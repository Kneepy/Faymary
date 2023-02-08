import {Controller} from "@nestjs/common";
import {GrpcMethod} from "@nestjs/microservices";
import {
    DialogActionEnum,
    DialogHistory,
    Dialogs,
    DIALOGS_SERVICE_METHODS,
    DIALOGS_SERVICE_NAME,
    ImpossibleAddUserDialog,
    InsufficientRightToMoveDialog,
    NotFoundDialog,
    NotFoundUserDialogs
} from "src/common";
import {DialogsService} from "src/providers";
import {
    AddUserDialogDTO,
    ChangeFileDialogDTO,
    ChangeNameDialogDTO,
    CreateDialogDTO,
    DeleteDialogDTO,
    DeleteUserDialogDTO,
    GetDialogDTO,
    GetHistoryDialogDTO,
    GetUserDialogsDTO
} from "../dtos";

@Controller()
export class DialogsController {
    constructor(private dialogsService: DialogsService) {}

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.ADD_USER_TO_DIALOG)
    async addUserToDialog(data: AddUserDialogDTO): Promise<DialogHistory> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(dialog) {
            const historyNote = await this.dialogsService.createHistoryNote({dialog, user_id: data.user_id, action: DialogActionEnum.ADD_USER, item_id: data.who_adds_id})

            if(await this.dialogsService.addUserDialog(dialog.id, data.who_adds_id))
                return historyNote
            else throw ImpossibleAddUserDialog
        }
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CREATE_DIALOG)
    async createDialog(data: CreateDialogDTO): Promise<Dialogs> {
        if(!Array.isArray(data.user_ids)) {
            data.user_ids = this.dialogsService.getUserIds(data.user_ids)
        }
        data.user_ids.push(data.creator_id)
        data.user_ids = this.dialogsService.joinUserIds(data.user_ids)

        const dialog = await this.dialogsService.create({user_ids: (data.user_ids) as string, creator_id: data.creator_id})
        const historyNotes = await this.dialogsService.createHistoryNote({dialog, user_id: data.creator_id, action: DialogActionEnum.CREATE_DIALOG})

        return dialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_DIALOG)
    async getDialog(data: GetDialogDTO): Promise<Dialogs> {
        if(!data.dialog_id)
            throw NotFoundDialog

        return await this.dialogsService.findOne({id: data.dialog_id})
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_ALL_USER_DIALOGS)
    async getUserDialogs({take, skip, ...data}: GetUserDialogsDTO): Promise<Dialogs[]> {
        if(!data.user_id)
            throw NotFoundUserDialogs

        return await this.dialogsService.findByUserId({user_id: data.user_id}, {take, skip})
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.DELETE_DILAOG)
    async deleteDialog(data: DeleteDialogDTO): Promise<any> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(data.user_id === dialog.creator_id && dialog) {
            return await this.dialogsService.remove(dialog.id)
        } else throw InsufficientRightToMoveDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.REMOVE_USER_DIALOG)
    async deleteUserFromDialog(data: DeleteUserDialogDTO): Promise<Dialogs> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(dialog) {
            if(dialog.creator_id === data.user_id) {
                const userIds = this.dialogsService.getUserIds(dialog.user_ids)
                const historyNote = await this.dialogsService.createHistoryNote({dialog, item_id: data.delete_id, action: DialogActionEnum.REMOVE_USER, user_id: data.user_id})

                dialog.user_ids = this.dialogsService.joinUserIds(userIds.splice(userIds.indexOf(data.delete_id), 1))

                return await this.dialogsService.update(dialog)
            } else throw InsufficientRightToMoveDialog
        } else throw NotFoundDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CHANGE_NAME_DIALOG)
    async changeNameDialog(data: ChangeNameDialogDTO): Promise<Dialogs> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(dialog) {
            dialog.name = data.name

            const historyNote = await this.dialogsService.createHistoryNote({dialog, action: DialogActionEnum.CHANGE_NAME_DIALOG, user_id: data.user_id, desc: data.name})

            return await this.dialogsService.update(dialog)
        } else throw NotFoundDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CHANGE_FILE_DIALOG)
    async changeFileDialog(data: ChangeFileDialogDTO): Promise<Dialogs> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(dialog) {
            dialog.file_id = data.file_id

            const historyNote = await this.dialogsService.createHistoryNote({dialog, action: DialogActionEnum.CHANGE_FILE_DIALOG, user_id: data.user_id, item_id: data.file_id})

            return await this.dialogsService.update(dialog)
        } else throw NotFoundDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_HISTORY_DIALOG)
    async getHistoryDialog({take, skip, ...data}: GetHistoryDialogDTO): Promise<DialogHistory[]> {
        return await this.dialogsService.findHistoryNotes({dialog_id: data.dialog_id}, {take, skip})
    }
}