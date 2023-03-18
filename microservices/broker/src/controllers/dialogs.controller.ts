import { MESSAGES_MODULE_CONFIG } from './../constants/app.constants';
import { Controller, ForbiddenException, Get, Inject, Query, Req } from "@nestjs/common";
import { DIALOGS_MODULE_CONFIG } from "src/constants/app.constants";
import { DialogHistories, Dialogs, DialogsServiceClient, GetHistoryDialogDTO, GetUserDialogsDTO } from "src/proto/dialogs";
import { GetMessageDTO, GetMessagesDTO, Message, Messages, MessagesSerivceClient } from "src/proto/messages";
import { ICustomRequest } from "src/types/request.type";

@Controller("dialog")
export class DialogsControllerer {
    constructor(
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesSerivceClient
    ) {}

    @Get("many")
    async getUserDialogs(@Query() data: GetUserDialogsDTO, @Req() {user_id}: ICustomRequest): Promise<Dialogs> {
        return await this.dialogsService.getAllUserDialogs({user_id, skip: data.skip, take: data.take}).toPromise()
    }

    /**
     * Эндпоинт выкенет ошибку при отсутсвии пользователя в диалоге
     */
    @Get("history")
    async getHistoryDialog(@Query() {dialog_id, take, skip}: GetHistoryDialogDTO, @Req() {user_id}: ICustomRequest): Promise<DialogHistories> {
        const historyNotes = await this.dialogsService.getHistoryDialog({dialog_id, skip, take}).toPromise()
        const userIsIncludedIntoDialog = await this.dialogsService.dialogIncludesUser({user_id, dialog_id}).toPromise()
        
        if(!userIsIncludedIntoDialog.isIncluded) throw new ForbiddenException()

        return historyNotes
    }

    @Get("messages")
    async getMessagesDialog(@Query() data: GetMessagesDTO, @Req() {user_id}: ICustomRequest): Promise<Messages> {
        const dialog = await this.dialogsService.getDialog({id: data.dialog_id}).toPromise()

        /**
         * Проверка на наличие пользователя в идалоге, если его там нет то и сообщения он не получит
         */
        if(!dialog.participants.find(user => user.user_id === user_id).user_id) throw new ForbiddenException()

        return await this.messagesService.getDialogMessages(data).toPromise()
    }

    @Get("message")
    async getMessage(@Query() data: GetMessageDTO): Promise<Message> {
        return await this.messagesService.getMessage(data).toPromise()
    }
}