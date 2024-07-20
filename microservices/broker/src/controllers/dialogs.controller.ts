import { MESSAGES_MODULE_CONFIG, USER_MODULE_CONFIG } from './../constants/app.constants';
import { Controller, ForbiddenException, Get, Inject, Query, Req } from "@nestjs/common";
import { DIALOGS_MODULE_CONFIG } from "src/constants/app.constants";
import { Dialog, DialogActionEnum, DialogsServiceClient, GetDialogDTO, GetHistoryDialogDTO, GetUserDialogsDTO } from "src/proto/dialogs";
import { GetMessageDTO, GetMessagesDTO, MessagesServiceClient } from "src/proto/messages";
import { UserServiceClient } from 'src/proto/user';
import {Addition, AdditionsType, BrokerResponse} from 'src/types';
import { ICustomRequest } from "src/types/request.type";
import { UtilsService } from 'src/utils/get-item.util';

@Controller("dialog")
export class DialogsController {
    constructor(
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        private utilsService: UtilsService
    ) {}

    @Get("many")
    async getUserDialogs(@Query() data: GetUserDialogsDTO, @Req() {user_id}: ICustomRequest): Promise<Dialog[]> {
        return (await this.dialogsService.getAllUserDialogs({user_id, skip: data.skip, take: data.take}).toPromise()).dialogs
    }

    @Get()
    async getDialog(@Query() data: GetDialogDTO): Promise<Dialog> {
        return await this.dialogsService.getDialog({id: data.id}).toPromise()
    }

    /**
     * Эндпоинт выкенет ошибку при отсутсвии пользователя в диалоге
     */
    @Get("history")
    async getHistoryDialog(@Query() {dialog_id, take, skip}: GetHistoryDialogDTO, @Req() {user_id}: ICustomRequest): Promise<BrokerResponse.DialogHistory[]> {
        const historyNotes = await this.dialogsService.getHistoryDialog({dialog_id, skip, take}).toPromise()
        const userIsIncludedIntoDialog = await this.dialogsService.dialogIncludesUser({user_id, dialog_id}).toPromise()
        
        if(!userIsIncludedIntoDialog.isIncluded) throw new ForbiddenException()

        return Promise.all(historyNotes.notes.map(async note => {
            if(note.action === DialogActionEnum.ADD_USER || note.action === DialogActionEnum.REMOVE_USER) {
                const attachments = this.utilsService.getItem(AdditionsType.USER, note.item_id)
                return {...note, attachments: {[attachments.key]: await attachments.data.toPromise()}}
            }
            
            return note
        }))
    }

    @Get("messages")
    async getMessagesDialog(@Query() data: GetMessagesDTO, @Req() { user_id }: ICustomRequest): Promise<BrokerResponse.Message[]> {
        const dialog = await this.dialogsService.getDialog({id: data.dialog_id}).toPromise()

        /**
         * Проверка на наличие пользователя в далоге, если его там нет то и сообщения он не получит
         */
        const userConsistDialog = dialog.participants.find(user => user.user_id === user_id).user_id
        if(!userConsistDialog) throw new ForbiddenException()

        const messages = (await this.messagesService.getDialogMessages(data).toPromise()).messages

        return Promise.all(messages.map(async message => {
            // собираем все вложения сообщения
            const attachments: Addition = {}

            for (const attachment of message.attachments) {

                const { data, key } = this.utilsService.getItem(<any>attachment.type, attachment.item_id)
                attachments[key] = await data.toPromise()

            }

            // получаем владельца сообщения
            const user = await this.userService.findUser({id: message.user_id}).toPromise()

            return {...message, attachments, user}
        }))
    }

    @Get("message")
    async getMessage(@Query() data: GetMessageDTO): Promise<BrokerResponse.Message> {
        const message = await this.messagesService.getMessage(data).toPromise()
        const user = await this.userService.findUser({id: message.user_id}).toPromise()
        const attachments: Addition = {}

        for (const attachment of message.attachments) {

            const { data, key } = this.utilsService.getItem(<any>attachment.type, attachment.item_id)
            attachments[key] = await data.toPromise()

        }

        return {...message, attachments, user}
    }
}