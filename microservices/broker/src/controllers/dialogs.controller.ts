import { MESSAGES_MODULE_CONFIG, USER_MODULE_CONFIG } from "./../constants/app.constants";
import { Controller, ForbiddenException, Get, Inject, Query, Req } from "@nestjs/common";
import { DIALOGS_MODULE_CONFIG } from "src/constants/app.constants";
import {
    DialogActionEnum,
    DialogsServiceClient,
    GetHistoryDialogDTO,
    GetUserDialogsDTO,
    ParticipantRights
} from "src/proto/dialogs";
import { GetMessageDTO, GetMessagesDTO, MessagesServiceClient } from "src/proto/messages";
import { FindUsersDTO, User, UserServiceClient } from "src/proto/user";
import { BrokerResponse } from "src/types";
import { ICustomRequest } from "src/types/request.type";
import { firstValueFrom } from "rxjs";
import { AttachmentsProvider } from "../providers";
import { AttachmentType } from "../proto/attachments";

@Controller("dialog")
export class DialogsController {
    constructor(
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        private attachmentsProvider: AttachmentsProvider,
    ) {}

    @Get("many")
    async getUserDialogs(@Query() data: GetUserDialogsDTO, @Req() {user_id}: ICustomRequest): Promise<BrokerResponse.Dialog[]> {
        const { dialogs } = await firstValueFrom(this.dialogsService.getAllUserDialogs({user_id, skip: data.skip, take: data.take}))

        return (dialogs ?? []).reduce(async (accumulator, dialog) => {
            const dialogTmp: BrokerResponse.Dialog = { ...dialog} as any
            const accumulatorValue = await accumulator

            const lastMessage = await firstValueFrom(this.messagesService.getLastDialogMessage({ dialog_id: dialog.id }))

            if (!!lastMessage.dialog_id) {
                const [ messageUser, messageAttachments] = await Promise.all([
                    firstValueFrom(this.userService.findUser({ id: lastMessage.user_id })),
                    this.attachmentsProvider.getAttachments({ parent_id: lastMessage.id, parent_type: AttachmentType.MESSAGE })
                ])

                dialogTmp.lastMessage = {...lastMessage, attachments: messageAttachments, user: messageUser }
            }

            const { participants } = await firstValueFrom(this.dialogsService.getParticipantsDialog({
                rights: [ParticipantRights.ADMIN, ParticipantRights.CREATOR, ParticipantRights.USER],
                dialog_id: dialog.id,
                take: 5,
                skip: 0
            }))

            dialogTmp.participants = await Promise.all(
                participants.map(async (participant) => {
                    const user = await firstValueFrom(this.userService.findUser({ id: participant.user_id }))

                    return { ...participant, user }
                })
            )

            accumulatorValue.push(dialogTmp)

            return accumulator
        }, Promise.resolve([]))
    }

    @Get("search-users")
    async searchUsersByDialogs(@Query() data: Pick<FindUsersDTO, "take" | "skip" | "fullName">, @Req() { user_id }: ICustomRequest): Promise<BrokerResponse.ResultSearchDialog> {
        /**
         * Сначала мы поулчаем всех юзеров которые участвовали в личных переписках с пользователем (до 2 участников диалога)
         * Проверяем нет ли среди них удовлетворяющих результатам поиска
         * Если нету то скипаем этот момент
         */
        const regex = new RegExp(data.fullName, "i")
        // все личные собеседники
        const { participants } = await firstValueFrom(this.dialogsService.getAllInterlocutorsUser({ user_id }))
        const allInterlocutors = await Promise.all([
            ...(participants ?? []).map(participant =>
                firstValueFrom(this.userService.findUser({ id: participant.user_id }))
            )
        ])
        // собеседники подходящие под условия поиска
        const matchesInterlocutors = allInterlocutors.reduce((acc, interlocutor) => {
            if (regex.test(interlocutor.fullName) && interlocutor.id !== user_id) acc.push(interlocutor)

            return acc
        }, [] as User[])

        // просто пользователи подходящие под условия поиска
        const matchedUsers = (await firstValueFrom(this.userService.findUsers({
            fullName: data.fullName,
            take: data.take,
            skip: data.skip
        }))).users?.filter(user =>
            !matchesInterlocutors.find(interlocutor => interlocutor.id === user.id) && user.id !== user_id
        )

        return { existing: matchesInterlocutors, nonexistent: matchedUsers }
    }

    @Get("history")
    async getHistoryDialog(@Query() {dialog_id, take, skip}: GetHistoryDialogDTO, @Req() {user_id}: ICustomRequest): Promise<BrokerResponse.DialogHistory[]> {
        const historyNotes = await this.dialogsService.getHistoryDialog({dialog_id, skip, take}).toPromise()
        const userIsIncludedIntoDialog = await this.dialogsService.dialogIncludesUser({user_id, dialog_id}).toPromise()
        
        if(!userIsIncludedIntoDialog.isIncluded) throw new ForbiddenException()

        return Promise.all(
            historyNotes.notes.map(async note => {
                if(note.action === DialogActionEnum.ADD_USER || note.action === DialogActionEnum.REMOVE_USER) {
                    const user = await firstValueFrom(this.userService.findUser({ id: note.item_id }))
                    return {...note, attachments: {users: [user]}}
                }

                return note
        }))
    }

    @Get("messages")
    async getMessagesDialog(@Query() data: GetMessagesDTO, @Req() { user_id }: ICustomRequest): Promise<BrokerResponse.Message[]> {
        /**
         * Проверка на наличие пользователя в далоге, если его там нет то и сообщения он не получит
         */
        const userConsistDialog = await this.dialogsService.dialogIncludesUser({ user_id, dialog_id: data.dialog_id }).toPromise()

        if(!userConsistDialog) throw new ForbiddenException()

        const { messages } = await this.messagesService.getDialogMessages(data).toPromise()

        if (!messages) return []

        return Promise.all(messages.map(async message => {
            const [ attachments, user ] = await Promise.all([
                // собираем все вложения сообщения
                this.attachmentsProvider.getAttachments({ parent_id: message.id, parent_type: AttachmentType.MESSAGE }),

                // получаем владельца сообщения
                this.userService.findUser({id: message.user_id}).toPromise()
            ])

            return {...message, attachments, user}
        }))
    }

    @Get("message")
    async getMessage(@Query() data: GetMessageDTO): Promise<BrokerResponse.Message> {
        const message = await this.messagesService.getMessage(data).toPromise()
        const [ attachments, user ] = await Promise.all([
            this.attachmentsProvider.getAttachments({ parent_id: message.id, parent_type: AttachmentType.MESSAGE }),
            this.userService.findUser({id: message.user_id}).toPromise()
        ])

        return { ...message, attachments, user }
    }
}