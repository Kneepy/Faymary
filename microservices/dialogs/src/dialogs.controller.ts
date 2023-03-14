import {Controller} from "@nestjs/common";
import {GrpcMethod} from "@nestjs/microservices";
import {
    DialogActionEnum,
    DialogHistory,
    Dialogs,
    DIALOGS_SERVICE_METHODS,
    DIALOGS_SERVICE_NAME,
    InsufficientRightToMoveDialog,
    NotFoundDialog,
    NotFoundUserDialogs,
    ParticipantRights
} from "src/common";
import { DialogsService } from "./dialogs.service";
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
} from "./dtos";

@Controller()
export class DialogsController {
    constructor(private dialogsService: DialogsService) {}

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.ADD_USER_TO_DIALOG)
    async addUserToDialog(data: AddUserDialogDTO): Promise<DialogHistory> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(!dialog) throw NotFoundDialog

        const historyNote = await this.dialogsService.createHistoryNote({dialog: dialog, user_id: data.user_id, action: DialogActionEnum.ADD_USER, item_id: data.user_invited_id})
        await this.dialogsService.addUserToDialog(dialog, {user_id: data.user_id, rights: ParticipantRights.USER})
    
        return historyNote
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CREATE_DIALOG)
    async createDialog({participants, name}: CreateDialogDTO): Promise<Dialogs> {
        const dialog = await this.dialogsService.create({participants, name})
        const creatorId = participants.find(participant => participant.rights === ParticipantRights.CREATOR).user_id ?? participants.find(participant => participant.rights === ParticipantRights.ADMIN).user_id
        const historyNote = await this.dialogsService.createHistoryNote({dialog, user_id: creatorId, action: DialogActionEnum.CREATE_DIALOG})

        return dialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_DIALOG)
    async getDialog(data: GetDialogDTO): Promise<Dialogs> {
        const dialog = await this.dialogsService.findOne({id: data.id}, {relations: {participants: true}})

        if(!data.id || !dialog) throw NotFoundDialog

        return dialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_ALL_USER_DIALOGS)
    async getUserDialogs({take, skip, ...data}: GetUserDialogsDTO): Promise<{dialogs: Dialogs[]}> {
        const dialogs = await this.dialogsService.findByUserId({user_id: data.user_id}, {take, skip, relations: {participants: true}});

        if(!data.user_id && !dialogs.length)
            throw NotFoundUserDialogs

        return {dialogs}
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.DELETE_DILAOG)
    async deleteDialog(data: DeleteDialogDTO): Promise<any> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})
        const participant = await this.dialogsService.findOneParticipantDialog({user_id: data.user_id, dialog_id: data.dialog_id})

        if(participant.rights === ParticipantRights.CREATOR && dialog && await this.dialogsService.remove(dialog.id)) {
            return {}
        } else throw InsufficientRightToMoveDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.REMOVE_USER_DIALOG)
    async deleteUserFromDialog(data: DeleteUserDialogDTO): Promise<DialogHistory> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})
        const userDeleted = await this.dialogsService.findOneParticipantDialog({user_id: data.delete_id, dialog_id: data.dialog_id})
        const deleter = await this.dialogsService.findOneParticipantDialog({user_id: data.user_id, dialog_id: data.dialog_id})

        if(dialog && deleter && userDeleted) {
            if(deleter.rights === ParticipantRights.CREATOR || deleter.rights === ParticipantRights.ADMIN) {
                const historyNote = await this.dialogsService.createHistoryNote({dialog, item_id: data.delete_id, action: DialogActionEnum.REMOVE_USER, user_id: data.user_id})

                await this.dialogsService.removeUserToDialog(dialog, userDeleted)

                return historyNote
            } else throw InsufficientRightToMoveDialog
        } else throw NotFoundDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CHANGE_NAME_DIALOG)
    async changeNameDialog(data: ChangeNameDialogDTO): Promise<Dialogs> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(!dialog && !data.dialog_id) throw NotFoundDialog

        dialog.name = data.name
        const historyNote = await this.dialogsService.createHistoryNote({dialog, action: DialogActionEnum.CHANGE_NAME_DIALOG, user_id: data.user_id, desc: data.name})

        return await this.dialogsService.update(dialog)
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CHANGE_FILE_DIALOG)
    async changeFileDialog(data: ChangeFileDialogDTO): Promise<Dialogs> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(!dialog && !data.dialog_id) throw NotFoundDialog
        
        dialog.file_id = data.file_id
        const historyNote = await this.dialogsService.createHistoryNote({dialog, action: DialogActionEnum.CHANGE_FILE_DIALOG, user_id: data.user_id, item_id: data.file_id})

        return await this.dialogsService.update(dialog)
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_HISTORY_DIALOG)
    async getHistoryDialog({take, skip, ...data}: GetHistoryDialogDTO): Promise<{notes: DialogHistory[]}> {
        return {notes: await this.dialogsService.findHistoryNotes({dialog: {id: data.dialog_id}}, {take, skip})}
    }
}