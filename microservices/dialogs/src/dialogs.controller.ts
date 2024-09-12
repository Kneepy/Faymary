import {Controller} from "@nestjs/common";
import {GrpcMethod} from "@nestjs/microservices";
import {
    DialogActionEnum,
    DialogHistory, DialogParticipants,
    Dialogs,
    DIALOGS_SERVICE_METHODS,
    DIALOGS_SERVICE_NAME, FewUsersCreateDialog,
    ImpossibleAddUserDialog,
    InsufficientRightToMoveDialog,
    NotFoundDialog,
    NotFoundUserDialogs,
    ParticipantRights,
    StateDialogEnum
} from "src/common";
import { DialogsService } from "./dialogs.service";
import {
    AddUserDialogDTO,
    ChangeFileDialogDTO,
    ChangeNameDialogDTO,
    CreateDialogDTO,
    DeleteDialogDTO,
    DeleteUserDialogDTO,
    DialogIncludeUserDTO,
    GetDialogDTO,
    GetHistoryDialogDTO,
    GetUserDialogsDTO, SearchUserDialogsDTO
} from "./dtos";
import {
    GetAllInterlocutorsUserDTO,
    GetAllParticipantsDialogDTO,
    GetParticipantsDialogDTO
} from "./dtos/get-participants-dialog.dto";
import { take } from "rxjs";
import { ILike, In } from "typeorm";

@Controller()
export class DialogsController {
    constructor(private dialogsService: DialogsService) {}

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.ADD_USER_TO_DIALOG)
    async addUserToDialog(data: AddUserDialogDTO): Promise<DialogHistory> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})
        const existInviter = await this.dialogsService.findOneParticipantDialog({dialog_id: data.dialog_id, user_id: data.user_id})

        if(!existInviter?.id) throw ImpossibleAddUserDialog
        if(!dialog) throw NotFoundDialog

        const historyNote = await this.dialogsService.createHistoryNote({dialog: dialog, user_id: data.user_id, action: DialogActionEnum.ADD_USER, item_id: data.user_invited_id})
        await this.dialogsService.addUserToDialog(dialog, {user_id: data.user_invited_id, rights: ParticipantRights.USER})
    
        return historyNote
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CREATE_DIALOG)
    async createDialog({participants, name}: CreateDialogDTO): Promise<Dialogs> {
        if (participants.length < 2) throw FewUsersCreateDialog

        if (participants.length === 2) {
            /**
             * TODO: Эту ересть надо переделать пока не знаю как но надо!!!!
             * Но ваще оно не сильно прожорливо должно быть т.к ищет только чаты с 2 участниками
             */
            const user_ids = participants.map(participant => participant.user_id)
            const dialogs = await this.dialogsService.find({
                number_participants: 2,
                participants: {
                    user_id: In(user_ids)
                } as any
            })
            const dialogsParticipants = await Promise.all(
                dialogs.map(dialog => this.dialogsService.findParticipantsDialog({ dialog_id: dialog.id }, { relations: {dialog: true} }))
            )
            const existDialogParticipants = dialogsParticipants.find(dialogParticipants =>
                dialogParticipants.every(participant => user_ids.includes(participant.user_id))
            )

            if (!!existDialogParticipants) {
                return {
                    ...existDialogParticipants[0].dialog,
                    participants: existDialogParticipants
                }
            }
        }

        const dialog = await this.dialogsService.create({participants, name})
        const creatorId = participants.find(participant => participant.rights === ParticipantRights.CREATOR)?.user_id ?? participants.find(participant => participant.rights === ParticipantRights.ADMIN)?.user_id
        const historyNote = await this.dialogsService.createHistoryNote({dialog, user_id: creatorId, action: DialogActionEnum.CREATE_DIALOG})

        return dialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_DIALOG)
    async getDialog(data: GetDialogDTO): Promise<Dialogs> {
        const dialog = await this.dialogsService.findOne({id: data.id})

        if(!data.id || !dialog) throw NotFoundDialog

        return dialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_PARTICIPANTS_DIALOG)
    async getParticipantsDialog(data: GetParticipantsDialogDTO): Promise<{ participants: DialogParticipants[] }> {
        const participants = await this.dialogsService.findParticipantsDialog({
            dialog_id: data.dialog_id,
            rights: data.rights
        }, {take: data.take, skip: data.skip})

        return { participants: participants ?? [] }
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_ALL_PARTICIPANTS_DIALOG)
    async getAllParticipantsDialog(data: GetAllParticipantsDialogDTO): Promise<{ participants: DialogParticipants[] }> {
        return { participants: await this.dialogsService.getAllParticipantsDialog({dialog_id: data.dialog_id}) }
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_ALL_INTERLOCUTORS_USER)
    async getAllInterlocutorsUser({ user_id }: GetAllInterlocutorsUserDTO): Promise<{ participants: DialogParticipants[] }> {
        return { participants: await this.dialogsService.getAllInterlocutorsUser({ user_id }) }
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_ALL_USER_DIALOGS)
    async getUserDialogs({take, skip, user_id}: GetUserDialogsDTO): Promise<{dialogs: Dialogs[]}> {
        const dialogs = await this.dialogsService.findByUserId({user_id, state: StateDialogEnum.ACTIVE}, { take, skip });

        if(!user_id && !dialogs.length)
            throw NotFoundUserDialogs

        return { dialogs }
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.DELETE_DIALOG)
    async deleteDialog(data: DeleteDialogDTO): Promise<DialogHistory> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})
        const participant = await this.dialogsService.findOneParticipantDialog({user_id: data.user_id, dialog_id: data.dialog_id})

        if(participant.rights === ParticipantRights.CREATOR && dialog && await this.dialogsService.remove(dialog.id)) {
            return await this.dialogsService.createHistoryNote({dialog, user_id: data.user_id, action: DialogActionEnum.DELETE_DIALOG})
        } else throw InsufficientRightToMoveDialog
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.REMOVE_USER_DIALOG)
    async deleteUserFromDialog(data: DeleteUserDialogDTO): Promise<DialogHistory> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})
        const userDeleted = await this.dialogsService.findOneParticipantDialog({user_id: data.delete_id, dialog_id: data.dialog_id})
        const deleter = await this.dialogsService.findOneParticipantDialog({user_id: data.user_id, dialog_id: data.dialog_id})
        console.log(dialog, userDeleted, deleter)

        if (!dialog || !deleter || !userDeleted) throw NotFoundDialog
        if (![ParticipantRights.ADMIN, ParticipantRights.CREATOR].includes(deleter.rights)) throw InsufficientRightToMoveDialog

        const historyNote = await this.dialogsService.createHistoryNote({dialog, item_id: data.delete_id, action: DialogActionEnum.REMOVE_USER, user_id: data.user_id})

        await this.dialogsService.removeUserToDialog(dialog, userDeleted)

        return historyNote
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CHANGE_NAME_DIALOG)
    async changeNameDialog(data: ChangeNameDialogDTO): Promise<DialogHistory> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(!dialog && !data.dialog_id) throw NotFoundDialog

        dialog.name = data.name
        const historyNote = await this.dialogsService.createHistoryNote({dialog, action: DialogActionEnum.CHANGE_NAME_DIALOG, user_id: data.user_id, desc: data.name})
        await this.dialogsService.update(dialog)

        return historyNote 
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.CHANGE_FILE_DIALOG)
    async changeFileDialog(data: ChangeFileDialogDTO): Promise<DialogHistory> {
        const dialog = await this.dialogsService.findOne({id: data.dialog_id})

        if(!dialog && !data.dialog_id) throw NotFoundDialog
        
        dialog.file_id = data.file_id
        const historyNote = await this.dialogsService.createHistoryNote({dialog, action: DialogActionEnum.CHANGE_FILE_DIALOG, user_id: data.user_id, item_id: data.file_id})
        await this.dialogsService.update(dialog)

        return historyNote
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.GET_HISTORY_DIALOG)
    async getHistoryDialog({take, skip, ...data}: GetHistoryDialogDTO): Promise<{notes: DialogHistory[]}> {
        return {notes: await this.dialogsService.findHistoryNotes({dialog: {id: data.dialog_id}}, {take, skip})}
    }

    @GrpcMethod(DIALOGS_SERVICE_NAME, DIALOGS_SERVICE_METHODS.DIALOG_INCLUDE_USER)
    async dialogIncludesUser({dialog_id, user_id}: DialogIncludeUserDTO): Promise<{isIncluded: boolean}> {
        if(!dialog_id || !user_id) throw NotFoundDialog

        return {isIncluded: !!(await this.dialogsService.findOneParticipantDialog({dialog_id, user_id}))}
    }
}