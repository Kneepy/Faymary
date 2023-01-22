import {InjectRepository} from "@nestjs/typeorm";
import {DEFAULT_SKIP_DIALOGS, DEFAULT_TAKE_DIALOGS, Dialogs} from "src/common";
import { CreateDialogInterface, FindDialogInterface, FindOneDialogInterface } from "src/interfaces";
import {FindManyOptions, Raw, Repository} from "typeorm";

export class DialogsService {
    constructor(@InjectRepository(Dialogs) private repository: Repository<Dialogs>) {}

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

    async create(args: CreateDialogInterface): Promise<Dialogs> {
        return await this.repository.save({...args})
    }

    async update(dialog: Dialogs): Promise<Dialogs> {
        return await this.repository.save(dialog)
    }

    async findOne(args: FindOneDialogInterface): Promise<Dialogs> {
        return await this.repository.findOne({where: args})
    }

    async find(args: FindDialogInterface, otherOptions: Omit<FindManyOptions<Dialogs>, "where">): Promise<Dialogs[]> {
        if(!otherOptions.take) otherOptions.take = DEFAULT_TAKE_DIALOGS;
        if(!otherOptions.skip) otherOptions.skip = DEFAULT_SKIP_DIALOGS;

        if(args.user_id) {
            return await this.repository.find({where: {user_ids: Raw((alias) => `FIND_IN_SET(${args.user_id}, ${alias}) <> 0`)}, ...otherOptions})
        }
    }

    async remove(id: string): Promise<any> {
        return await this.repository.delete(id)
    }
}