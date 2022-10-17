import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Sessions } from "../entities/session.entity";
import { CreateSession } from "../interfaces";

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Sessions) private repository: Repository<Sessions>
    ) {}

    async findOne(where: FindOptionsWhere<Sessions>, otherOptions?: Omit<FindOneOptions<Sessions>, "where">): Promise<Sessions> {
        return await this.repository.findOne({where, ...otherOptions})
    }

    async create(session: CreateSession): Promise<Sessions> {
        return await this.repository.save({...session, createdAt: Date.now()})
    }

    async delete(id: string): Promise<any> {
        return await this.repository.delete(id)
    }
}