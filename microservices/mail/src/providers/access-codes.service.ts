import { InjectRepository } from "@nestjs/typeorm";
import { AccessCodes } from "src/access-codes.entity";
import { LIFE_TIME_ACCESS_CODE } from "src/constants";
import { CreateAccessCodeInterface, FindOneAccessCodeInterface } from "src/interfaces";
import { Raw, Repository } from "typeorm";

export class AccessCodesService {
    constructor(
        @InjectRepository(AccessCodes) private repository: Repository<AccessCodes>
    ) {}

    async findOne(args: FindOneAccessCodeInterface): Promise<AccessCodes> {
        return await this.repository.findOne({where: {...args, createdAt: Raw(alias => `(${alias} + ${LIFE_TIME_ACCESS_CODE}) > ${Date.now()}`)}})
    }

    async create(input: CreateAccessCodeInterface): Promise<AccessCodes> {
        return await this.repository.save({...input, createdAt: Date.now()})
    }

    async delete(id: string): Promise<any> {
        return await this.repository.delete(id)
    }
}