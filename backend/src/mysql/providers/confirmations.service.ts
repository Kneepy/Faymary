import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Confirmations } from "src/entity";
import { Repository } from "typeorm";
import { ConfirmationsInput, FindOneOptions } from "../dto";
import { ConfirmationsArgs } from "../dto/confirmations/confirmations.args";

@Injectable()
export class ConfirmationsService {
    constructor(
        @InjectRepository(Confirmations) private repository: Repository<Confirmations>
    ) {}

    async create(input: ConfirmationsInput): Promise<Confirmations> {
        return await this.repository.save(input)
    }

    public async findOne(
        args: ConfirmationsArgs,
        options: FindOneOptions
    ): Promise<Confirmations> {
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }

    async delete(id: string) {
        return await this.repository.delete(id)
    }
}