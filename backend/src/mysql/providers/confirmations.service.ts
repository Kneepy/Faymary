import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EXPIRES_IN_CONFORMATION } from "src/config";
import { Confirmations } from "src/entity";
import { Repository } from "typeorm";
import { ConfirmationsInput, ConfirmationsArgs, FindOneOptions } from "../dto";

@Injectable()
export class ConfirmationsService {
    constructor(
        @InjectRepository(Confirmations)
        private repository: Repository<Confirmations>
    ) {}

    async create(input: ConfirmationsInput): Promise<Confirmations> {
        return await this.repository.save({...input, createdAt: Date.now(), expirensIn: Date.now() + EXPIRES_IN_CONFORMATION});
    }

    public async findOne(
        args: ConfirmationsArgs,
        options?: FindOneOptions
    ): Promise<Confirmations> {
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }

    async delete(id: string) {
        return await this.repository.delete(id);
    }
}
