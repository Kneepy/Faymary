import { Controller, ForbiddenException, Get, Inject, Query, Req } from "@nestjs/common";
import { DIALOGS_MODULE_CONFIG } from "src/constants/app.constants";
import { DialogHistories, Dialogs, DialogsServiceClient, GetHistoryDialogDTO, GetUserDialogsDTO } from "src/proto/dialogs";
import { ICustomRequest } from "src/types/request.type";

@Controller("dialog")
export class DialogsControllerer {
    constructor(
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient
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
}