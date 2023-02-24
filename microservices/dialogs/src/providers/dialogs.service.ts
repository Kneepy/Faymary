import {InjectRepository} from "@nestjs/typeorm";
import {
    DEFAULT_SKIP_DIALOGS,
    DEFAULT_SKIP_HISTORY_DIALOG,
    DEFAULT_TAKE_DIALOGS,
    DEFAULT_TAKE_HISTORY_DIALOG, DialogActionEnum,
    DialogHistory,
    Dialogs,
    StateDialogEnum
} from "src/common";
import {CreateDialogInterface, FindDialogInterface, FindOneDialogInterface} from "src/interfaces";
import {FindManyOptions, FindOneOptions, Raw, Repository} from "typeorm";

export class DialogsService {
    constructor(
        @InjectRepository(Dialogs) private repository: Repository<Dialogs>,
        @InjectRepository(DialogHistory) private historyRepostiory: Repository<DialogHistory>
    ) {}

    async addUserDialog(dialogId: string, user_id: string): Promise<Boolean> {
        const dialog = await this.findOne({id: dialogId})

        if(dialog) {
            const userIds = dialog.user_ids.split(",")

            userIds.push(user_id)
            dialog.user_ids = userIds.join()
            await this.update(dialog)

            return true
        }

        return false
    }

    // CRUD for history
    async createHistoryNote(args: Omit<DialogHistory, "id" | "createdAt">): Promise<DialogHistory> {
        return await this.historyRepostiory.save({...args, createdAt: Date.now()})
    }
    async findHistoryNotes(data: Partial<Pick<DialogHistory, "action">> & {dialog_id?: string}, otherOptions: Omit<FindManyOptions<DialogHistory>, "where">): Promise<DialogHistory[]> {
        const req: any = {}

        if(!otherOptions.take) otherOptions.take = DEFAULT_TAKE_HISTORY_DIALOG;
        if(!otherOptions.skip) otherOptions.skip = DEFAULT_SKIP_HISTORY_DIALOG;
        if(data.dialog_id) {
            req.dialog = {id: data.dialog_id}
            otherOptions.relations = Object.assign(otherOptions.relations, {dialog: true}) // хз править надо
        }

            return await this.historyRepostiory.find({where: data, ...otherOptions})
    }

    // CRUD for dialogs
    async create(args: CreateDialogInterface): Promise<Dialogs> {
        return await this.repository.save({...args, state: StateDialogEnum.ACTIVE})
    }

    async update(dialog: Dialogs): Promise<Dialogs> {
        return await this.repository.save(dialog)
    }

    async findOne(args: FindOneDialogInterface, otherOptions?: Omit<FindOneOptions<Dialogs>, "where">): Promise<Dialogs> {
        return await this.repository.findOne({where: args})
    }

    async findByUserId(args: FindDialogInterface, otherOptions: Omit<FindManyOptions<Dialogs>, "where">): Promise<Dialogs[]> {
        if(!otherOptions.take) otherOptions.take = DEFAULT_TAKE_DIALOGS;
        if(!otherOptions.skip) otherOptions.skip = DEFAULT_SKIP_DIALOGS;

        if(args.user_id) {
            return await this.repository.find({where: {user_ids: Raw((alias) => `FIND_IN_SET(${args.user_id}, ${alias}) <> 0`)}, ...otherOptions})
        }
    }

    // просто изменяет состояние без удаления записи
    async remove(id: string): Promise<boolean> {
        const dialog = await this.findOne({id: id})

        if(dialog) {
            dialog.state = StateDialogEnum.DELETED

            await this.update(dialog)

            return true
        } else return false
    }

    // полностью удаляет запись
    async delete(id: string): Promise<any> {
        return await this.repository.delete(id)
    }

    getUserIds = (userIds: string): string[] => userIds.split(",")

    joinUserIds = (userIds: string[]): string => userIds.join(",")

}