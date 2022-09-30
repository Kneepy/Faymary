import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Dialogs, DialogUserRelationships, Messages, Users } from "src/entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { DialogsArgs, DialogsInput, ManyDialogsArgs } from "../dto";

@Injectable()
export class DialogsService {
    constructor(
        @InjectRepository(Dialogs) private repository: Repository<Dialogs>,
        @InjectRepository(DialogUserRelationships) private relationshipsRepo: Repository<DialogUserRelationships>
    ) {}
    
    public async addMessage(message: Messages) {
        return await this.repository.createQueryBuilder().relation(Dialogs, "messages").of(message.dialog).add(message)
    }

    public async addUser(dialog: Dialogs, invited: Users, inviter?: Users): Promise<void> {
        if(inviter) {
            const relationship = await this.relationshipsRepo.save({dialog, invited, inviter})
            await this.repository.createQueryBuilder().relation(Dialogs, "relationships").of(dialog).add(relationship)
        }
        await this.repository.createQueryBuilder().relation(Dialogs, "users").of(dialog).add(invited)
    }

    public async removeUser(dialog: Dialogs, user: Users): Promise<void> {
        await this.repository.createQueryBuilder().relation(Dialogs, "users").of(dialog).remove(user)
    }

    public async removeRelationship(id: string): Promise<any> {
        return await this.relationshipsRepo.delete(id)
    }

    public async findOne(args: DialogsArgs, options?: FindOneOptions<Dialogs>): Promise<Dialogs> {
        return await this.repository.findOne({
            where: args,
            ...options
        })
    }

    public async find(args: ManyDialogsArgs, options: FindManyOptions<Dialogs>): Promise<Dialogs[]> {
        return await this.repository.find({
            where: args,
            ...options
        })
    }

    public async update(args: Dialogs): Promise<Dialogs> {
        return await this.repository.save(args)
    }

    public async create(input: DialogsInput): Promise<Dialogs> {
        return await this.repository.save(input)
    }

    public async delete(id: string): Promise<any> {
        return await this.repository.delete(id)
    }
}