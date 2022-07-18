import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/auth";
import { Sessions } from "src/entity";
import { Repository } from "typeorm";
import { FindOneOptions, ManySessionsArgs, SessionsArgs, SessionsInput } from "../dto";

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Sessions) private repository: Repository<Sessions>,
    ) {}

    public async create(args: SessionsInput): Promise<Sessions> {
        return await this.repository.save(args);
    }

    public async find(
        args: ManySessionsArgs,
        options: FindOneOptions,
    ): Promise<Sessions[]> {
        return await this.repository.find({
            where: args,
            ...options,
        });
    }

    public async findOne(
        args: SessionsArgs,
        options: FindOneOptions,
    ): Promise<Sessions> {
        return await this.repository.findOne({
            where: args,
            ...options
        })
    }

    public async delete(sessionId) {
        return await this.repository.delete({ id: sessionId });
    }
}
