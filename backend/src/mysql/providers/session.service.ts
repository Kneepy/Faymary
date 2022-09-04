import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EXPIRENS_IN_REFRESH_TOKEN } from "src/config";
import { Sessions } from "src/entity/sessions.entity";
import { Repository } from "typeorm";
import {
    FindOneOptions,
    ManySessionsArgs,
    SessionsArgs,
    SessionsInput
} from "../dto";

//console.log(Sessions)

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Sessions) private repository: Repository<Sessions>
    ) {}

    public async create(args: SessionsInput): Promise<Sessions> {
        return await this.repository.save({...args, createdAt: Date.now(), expiresIn: Date.now() + EXPIRENS_IN_REFRESH_TOKEN});
    }

    public async find(
        args: ManySessionsArgs,
        options: FindOneOptions
    ): Promise<Sessions[]> {
        return await this.repository.find({
            where: args,
            ...options
        });
    }

    public async findOne(
        args: SessionsArgs,
        options: FindOneOptions
    ): Promise<Sessions> {
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }

    public async delete(sessionId: string) {
        return await this.repository.delete({ id: sessionId });
    }
}
