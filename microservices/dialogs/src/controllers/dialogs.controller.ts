import {Controller} from "@nestjs/common";
import {GrpcMethod} from "@nestjs/microservices";
import {
    DialogActionEnum,
    Dialogs,
    DIALOGS_SERVICE_METHODS,
    DIALOGS_SERVICE_NAME,
    ImpossibleAddUserDialog,
    InsufficientRightToMoveDialog,
    ModifiedDialog,
    ModifiedDialogHistory,
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
    async addUserToDialog(data: AddUserDialogDTO): Promise<ModifiedDialogHistory> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(dialog) {
            const historyNote = await this.dialogsService.createHistoryNote({dialog: dialog, user_id: data.user_id, action: DialogActionEnum.ADD_USER, item_id: data.who_adds_id})

            if(await this.dialogsService.addUserDialog(dialog.id, data.who_adds_id))
                return historyNote
            else throw ImpossibleAddUserDialog
        }
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CREATE_DIALOG)
    async createDialog({user_ids, creators_ids}: CreateDialogDTO): Promise<ModifiedDialog> {
        const dialog = await this.dialogsService.create({user_ids, creators_ids})
        const historyNotes = await this.dialogsService.createHistoryNote({dialog, user_id: creators_ids[0], action: DialogActionEnum.CREATE_DIALOG})

        return dialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_DIALOG)
    async getDialog(data: GetDialogDTO): Promise<ModifiedDialog> {
        const dialog = await this.dialogsService.findOne({id: data.id})

        if(!data.id && !dialog) throw NotFoundDialog

        return dialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_ALL_USER_DIALOGS)
    async getUserDialogs({take, skip, ...data}: GetUserDialogsDTO): Promise<Dialogs[]> {
        const dialogs = await this.dialogsService.findByUserId({user_id: data.user_id}, {take, skip});

        if(!data.user_id && !dialogs.length)
            throw NotFoundUserDialogs

        return dialogs
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.DELETE_DILAOG)
    async deleteDialog(data: DeleteDialogDTO): Promise<any> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(dialog.creators_ids.includes(data.user_id) && dialog) {
            return await this.dialogsService.remove(dialog.id)
        } else throw InsufficientRightToMoveDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.REMOVE_USER_DIALOG)
    async deleteUserFromDialog(data: DeleteUserDialogDTO): Promise<ModifiedDialog> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})
        const userIncludeIndex = dialog.user_ids.indexOf(data.delete_id)

        if(dialog && userIncludeIndex !== -1) {
            if(dialog.creators_ids.includes(data.user_id)) {
                const historyNote = await this.dialogsService.createHistoryNote({dialog, item_id: data.delete_id, action: DialogActionEnum.REMOVE_USER, user_id: data.user_id})

                dialog.user_ids = dialog.user_ids.splice(userIncludeIndex, 1)

                return await this.dialogsService.update(dialog)
            } else throw InsufficientRightToMoveDialog
        } else throw NotFoundDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CHANGE_NAME_DIALOG)
    async changeNameDialog(data: ChangeNameDialogDTO): Promise<ModifiedDialog> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(dialog) {
            dialog.name = data.name

            const historyNote = await this.dialogsService.createHistoryNote({dialog, action: DialogActionEnum.CHANGE_NAME_DIALOG, user_id: data.user_id, desc: data.name})

            return await this.dialogsService.update(dialog)
        } else throw NotFoundDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CHANGE_FILE_DIALOG)
    async changeFileDialog(data: ChangeFileDialogDTO): Promise<ModifiedDialog> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(dialog) {
            dialog.file_id = data.file_id

            const historyNote = await this.dialogsService.createHistoryNote({dialog, action: DialogActionEnum.CHANGE_FILE_DIALOG, user_id: data.user_id, item_id: data.file_id})

            return await this.dialogsService.update(dialog)
        } else throw NotFoundDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_HISTORY_DIALOG)
    async getHistoryDialog({take, skip, ...data}: GetHistoryDialogDTO): Promise<ModifiedDialogHistory[]> {
        return await this.dialogsService.findHistoryNotes({dialog: {id: data.dialog_id}}, {take, skip})
    }
}