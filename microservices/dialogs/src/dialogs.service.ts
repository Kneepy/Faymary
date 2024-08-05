import {InjectRepository} from "@nestjs/typeorm";
import {
    DEFAULT_SKIP_DIALOGS,
    DEFAULT_SKIP_HISTORY_DIALOG,
    DEFAULT_TAKE_DIALOGS,
    DEFAULT_TAKE_HISTORY_DIALOG,
    DialogHistory,
    Dialogs,
    StateDialogEnum,
    DialogParticipants, DEFAULT_TAKE_PARTICIPANTS_DIALOG, DEFAULT_SKIP_PARTICIPANTS_DIALOG
} from "src/common";
import { DialogsInterfaces } from "src/interfaces";
import { DeepPartial, FindManyOptions, FindOneOptions, In, Repository } from "typeorm";

export class DialogsService {
    constructor(
        @InjectRepository(Dialogs) private repository: Repository<Dialogs>,
        @InjectRepository(DialogHistory) private historyRepository: Repository<DialogHistory>,
        @InjectRepository(DialogParticipants) private participantsRepository: Repository<DialogParticipants>
    ) {}

    async addUserToDialog(dialog: Dialogs, participant: Omit<DialogParticipants, "id" | "dialog">): Promise<void> {
        const existParticipant = await this.findOneParticipantDialog({user_id: participant.user_id, dialog_id: dialog.id})

        if (!!existParticipant) return

        await this.createParticipantDialog({dialog, user_id: participant.user_id, rights: participant.rights})

        dialog.number_participants++
        await this.repository.save(dialog)
    }

    async removeUserToDialog(dialog: Dialogs, participant: Omit<DialogParticipants, "id" | "dialog">): Promise<void> {
        const removedParticipant = await this.findOneParticipantDialog({dialog_id: dialog.id, user_id: participant.user_id})

        if (!removedParticipant) return

        await this.deleteParticipantDialog(removedParticipant.id)

        dialog.number_participants--
        await this.repository.save(dialog)
    }

    // CRUD for participants
    async findOneParticipantDialog({user_id, dialog_id}: DialogsInterfaces.FindOneParticipantDialog, otherOptions?: Omit<FindOneOptions<DialogParticipants>, "where">): Promise<DialogParticipants> {
        if (!user_id || !dialog_id) return

        return await this.participantsRepository.findOne({where: {user_id, dialog: {id: dialog_id}}, ...otherOptions})
    }
    async findParticipantsDialog({ dialog_id, rights }: DialogsInterfaces.FindParticipantsDialog, otherOptions: Omit<FindManyOptions<DialogParticipants>, "where"> = {take: DEFAULT_TAKE_PARTICIPANTS_DIALOG, skip: DEFAULT_SKIP_PARTICIPANTS_DIALOG}) {
        if (!dialog_id) return []

        const criteria = {} as any
        if (rights?.length) criteria.rights = In(rights)

        return this.participantsRepository.find({ where: {dialog: {id: dialog_id}, ...criteria }, ...otherOptions })
    }
    async getAllParticipantsDialog({ dialog_id }: { dialog_id: string }): Promise<DialogParticipants[]> {
        if (!dialog_id) return []

        return this.participantsRepository.findBy({ dialog: { id: dialog_id } })
    }
    async createParticipantDialog(participant: Omit<DialogParticipants, "id">): Promise<DialogParticipants> {
        return await this.participantsRepository.save(participant)
    }
    async deleteParticipantDialog(id: string): Promise<any> {
        return await this.participantsRepository.delete(id)
    }
    async getAllInterlocutorsUser({ user_id }: Pick<DialogParticipants, "user_id">): Promise<DialogParticipants[]> {
        const interlocutors = await this.participantsRepository.findBy({
            dialog: { participants: { user_id }, number_participants: 2 }
        })

        return interlocutors ?? []
    }

    // CRUD for history
    async createHistoryNote(historyData: Omit<DialogHistory, "id" | "createdAt">): Promise<DialogHistory> {
        return await this.historyRepository.save({createdAt: Date.now(), ...historyData})
    }
    async findHistoryNotes(data: DeepPartial<DialogHistory>, otherOptions: Omit<FindManyOptions<DialogHistory>, "where"> = {take: DEFAULT_TAKE_HISTORY_DIALOG, skip: DEFAULT_SKIP_HISTORY_DIALOG}): Promise<DialogHistory[]> {
        return await this.historyRepository.find({where: data, ...otherOptions})
    }

    // CRUD for dialogs
    async create({participants, name}: DialogsInterfaces.CreateDialog): Promise<Dialogs> {
        return await this.repository.save({participants, name, state: StateDialogEnum.ACTIVE, number_participants: participants.length})
    }

    async update(dialog: Dialogs): Promise<Dialogs> {
        return await this.repository.save(dialog)
    }

    async findOne(args: DialogsInterfaces.FindOneDialog, otherOptions?: Omit<FindOneOptions<Dialogs>, "where">): Promise<Dialogs> {
        return await this.repository.findOne({where: args, ...otherOptions})
    }

    async find(data: DialogsInterfaces.FindManyDialogs, otherOptions: Omit<FindManyOptions<Dialogs>, "where"> = {take: DEFAULT_TAKE_DIALOGS, skip: DEFAULT_SKIP_DIALOGS}): Promise<Dialogs[]> {
        return await this.repository.find({where: data, ...otherOptions})
    }

    async findByUserId({user_id, state = StateDialogEnum.ACTIVE}: DialogsInterfaces.FindManyDialogsByUserId, otherOptions: Omit<FindManyOptions<Dialogs>, "where"> = {take: DEFAULT_TAKE_DIALOGS, skip: DEFAULT_SKIP_DIALOGS}): Promise<Dialogs[]> {
        if(!user_id) return

        return await this.repository.find({ where: { participants: { user_id }, state }, ...otherOptions })
    }

    // просто изменяет состояние без удаления записи
    async remove(id: string): Promise<boolean> {
        const dialog = await this.findOne({id: id})

        if(dialog && id) {
            dialog.state = StateDialogEnum.DELETED
            await this.update(dialog)

            return true
        } else return false
    }

    // полностью удаляет запись
    async delete(id: string): Promise<any> {
        return await this.repository.delete(id)
    }
}