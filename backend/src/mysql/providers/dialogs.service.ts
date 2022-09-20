import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Dialogs } from "src/entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { DialogsArgs, DialogsInput, ManyDialogsArgs } from "../dto";

@Injectable()
export class DialogsService {
    constructor(
        @InjectRepository(Dialogs) private repository: Repository<Dialogs>
    ) {}

    public async findOne(args: DialogsArgs, options: FindOneOptions<Dialogs>): Promise<Dialogs> {
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

    public async create(input: DialogsInput): Promise<Dialogs> {
        return await this.repository.save(input)
    }

    public async delete(id: string): Promise<any> {
        return await this.repository.delete(id)
    }
}