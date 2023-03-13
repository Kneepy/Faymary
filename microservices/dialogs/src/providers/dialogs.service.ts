import {InjectRepository} from "@nestjs/typeorm";
import {
    DEFAULT_SKIP_DIALOGS,
    DEFAULT_SKIP_HISTORY_DIALOG,
    DEFAULT_TAKE_DIALOGS,
    DEFAULT_TAKE_HISTORY_DIALOG,
    DialogHistory,
    Dialogs,
    ModifiedDialog,
    StateDialogEnum,
    ModifiedDialogHistory
} from "src/common";
import {CreateDialogInterface, FindDialogInterface, FindOneDialogInterface} from "src/interfaces";
import {DeepPartial, FindManyOptions, FindOneOptions, Raw, Repository} from "typeorm";

export class DialogsService {
    constructor(
        @InjectRepository(Dialogs) private repository: Repository<Dialogs>,
        @InjectRepository(DialogHistory) private historyRepostiory: Repository<DialogHistory>
    ) {}

    async addUserDialog(dialogId: string, user_id: string): Promise<Boolean> {
        const dialog = await this.findOne({id: dialogId})

        if(dialog) {
            dialog.user_ids.push(user_id)
            await this.update(dialog)

            return true
        }

        return false
    }

    // CRUD for history
    async createHistoryNote({dialog, ...data}: Omit<ModifiedDialogHistory, "id" | "createdAt">): Promise<ModifiedDialogHistory> {
        const dialogHistory = await this.historyRepostiory.save({dialog: this.convertModifiedDialogToDialog(dialog), createdAt: Date.now(),  ...data})

        return this.convertHistoryDialogToModifiedHistoryDialog(dialogHistory)
    }
    async findHistoryNotes(data: DeepPartial<ModifiedDialogHistory>, otherOptions: Omit<FindManyOptions<DialogHistory>, "where"> = {take: DEFAULT_TAKE_HISTORY_DIALOG, skip: DEFAULT_SKIP_HISTORY_DIALOG}): Promise<ModifiedDialogHistory[]> {
        const dialogHistories = await this.historyRepostiory.find({where: this.convertModifiedHistoryDialogToHistoryDialog(data as ModifiedDialogHistory), ...otherOptions})
        dialogHistories.forEach(dialogHistory => dialogHistory = this.convertHistoryDialogToModifiedHistoryDialog(dialogHistory) as any)
        
        return dialogHistories as any
    }

    // CRUD for dialogs
    async create(args: CreateDialogInterface): Promise<ModifiedDialog> {
        return this.convertDialogToModifiedDialog(await this.repository.save({user_ids: this.joinUserIds(args.user_ids), creators_ids: this.joinUserIds(args.creators_ids), state: StateDialogEnum.ACTIVE}))
    }

    async update(dialog: ModifiedDialog): Promise<ModifiedDialog> {
        const updatedDialog = await this.repository.save(this.convertModifiedDialogToDialog(dialog))

        return this.convertDialogToModifiedDialog(updatedDialog)
    }

    async findOne(args: FindOneDialogInterface, otherOptions?: Omit<FindOneOptions<Dialogs>, "where">): Promise<ModifiedDialog> {
        const dialog = await this.repository.findOne({where: args})

        return this.convertDialogToModifiedDialog(dialog)
    }

    async find(data: Omit<Dialogs, "id" | "user_ids" | "creators_ids">, otherOptions: Omit<FindManyOptions<Dialogs>, "where"> = {take: DEFAULT_TAKE_DIALOGS, skip: DEFAULT_SKIP_DIALOGS}): Promise<ModifiedDialog[]> {
        const dialogs = await this.repository.find({where: data, ...otherOptions})

        dialogs.forEach(dialog => dialog = this.convertDialogToModifiedDialog(dialog) as any)

        return dialogs as any
    }

    async findByUserId(args: FindDialogInterface, otherOptions: Omit<FindManyOptions<Dialogs>, "where"> = {take: DEFAULT_TAKE_DIALOGS, skip: DEFAULT_SKIP_DIALOGS}): Promise<Dialogs[]> {
        if(args.user_id) {
            const dialogs = await this.repository.find({where: {user_ids: Raw((alias) => `FIND_IN_SET(${args.user_id}, ${alias}) <> 0`)}, ...otherOptions})

            dialogs.forEach(dialog => dialog = this.convertDialogToModifiedDialog(dialog) as any)

            return dialogs as any
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

    getUserIds = (userIds: string): string[] => userIds?.split(",")
    joinUserIds = (userIds: string[]): string => userIds?.join(",")

    // фига из-за этого говна навалено, всякие новые ModifiedDialog и т.п
    // из не модифицированного в модифицированное
    convertDialogToModifiedDialog = (dialog: Dialogs): ModifiedDialog => Object.assign(dialog, {creators_ids: this.getUserIds(dialog?.creators_ids), user_ids: this.getUserIds(dialog?.user_ids)})
    // из модифицированного в не модифицированное
    convertModifiedDialogToDialog = (ModifiedDialog: ModifiedDialog): Dialogs => Object.assign(ModifiedDialog, {creators_ids: this.joinUserIds(ModifiedDialog?.creators_ids), user_ids: this.joinUserIds(ModifiedDialog?.user_ids)}) 

    // из модифицированного в не модифицированное    
    convertModifiedHistoryDialogToHistoryDialog = (modifiedHistoryDialog: ModifiedDialogHistory): DialogHistory => Object.assign(modifiedHistoryDialog, {dialog: this.convertModifiedDialogToDialog(modifiedHistoryDialog.dialog)})
    // из не модифицированного в модифицированное
    convertHistoryDialogToModifiedHistoryDialog = (historyDialog: DialogHistory): ModifiedDialogHistory => Object.assign(historyDialog, {dialog: this.convertDialogToModifiedDialog(historyDialog.dialog)})
}