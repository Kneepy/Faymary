import {InjectRepository} from "@nestjs/typeorm";
import {
    DEFAULT_SKIP_DIALOGS,
    DEFAULT_SKIP_HISTORY_DIALOG,
    DEFAULT_TAKE_DIALOGS,
    DEFAULT_TAKE_HISTORY_DIALOG,
    DialogHistory,
    Dialogs,
    StateDialogEnum,
    DialogParticipants
} from "src/common";
import {DialogsInterfaces} from "src/interfaces";
import {DeepPartial, FindManyOptions, FindOneOptions, Repository} from "typeorm";

export class DialogsService {
    constructor(
        @InjectRepository(Dialogs) private repository: Repository<Dialogs>,
        @InjectRepository(DialogHistory) private historyRepostiory: Repository<DialogHistory>,
        @InjectRepository(DialogParticipants) private participantsRepository: Repository<DialogParticipants>
    ) {}

    async addUserToDialog(dialog: Dialogs, participant: Omit<DialogParticipants, "id" | "dialog">): Promise<void> {
        this.repository.createQueryBuilder().relation(Dialogs, "participants").of(dialog).add(participant)
    }

    async removeUserToDialog(dialog: Dialogs, participant: Omit<DialogParticipants, "id" | "dialog">): Promise<void> {
        this.repository.createQueryBuilder().relation(Dialogs, "participants").of(dialog).remove(participant)
    }

    // CRUD for participants
    async findOneParticipantDialog({user_id, dialog_id}: DialogsInterfaces.PindOneParticipantDialog, otherOptions?: Omit<FindOneOptions<DialogParticipants>, "where">): Promise<DialogParticipants> {
        if(user_id && dialog_id) return await this.participantsRepository.findOne({where: {user_id, dialog: {id: dialog_id}}, ...otherOptions})
        
        return {} as any
    }

    // CRUD for history
    async createHistoryNote(historyData: Omit<DialogHistory, "id" | "createdAt">): Promise<DialogHistory> {
        return await this.historyRepostiory.save({createdAt: Date.now(), ...historyData})
    }
    async findHistoryNotes(data: DeepPartial<DialogHistory>, otherOptions: Omit<FindManyOptions<DialogHistory>, "where"> = {take: DEFAULT_TAKE_HISTORY_DIALOG, skip: DEFAULT_SKIP_HISTORY_DIALOG}): Promise<DialogHistory[]> {
        return await this.historyRepostiory.find({where: data, ...otherOptions})
    }

    // CRUD for dialogs
    async create({participants}: DialogsInterfaces.CreateDialog): Promise<Dialogs> {
        return await this.repository.save({participants, state: StateDialogEnum.ACTIVE})
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

    async findByUserId({user_id}: DialogsInterfaces.FindManyDialogsByUserId, otherOptions: Omit<FindManyOptions<Dialogs>, "where"> = {take: DEFAULT_TAKE_DIALOGS, skip: DEFAULT_SKIP_DIALOGS}): Promise<Dialogs[]> {
        if(user_id) {
            return await this.repository.find({where: {participants: {user_id}}, ...otherOptions})
        }
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