import { InjectRepository } from "@nestjs/typeorm";
import {
    MessageCreateInterface,
    MessageFindManyInterface,
    MessageFindOneInterface,
    MessageUpdateInterface
} from "./interfaces";
import {
    DEFAULT_SKIP_MESSAGES,
    DEFAULT_TAKE_MESSAGES,
    Messages
} from "./common";
import { Injectable } from "@nestjs/common";
import { FindManyOptions, Repository } from "typeorm";

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Messages) private repository: Repository<Messages>
    ) {}

    async create(args: MessageCreateInterface): Promise<Messages> {
        return await this.repository.save({ ...args, createdAt: Date.now() });
    }

    async findOne(args: MessageFindOneInterface): Promise<Messages> {
        return await this.repository.findOne({ where: args });
    }

    async find(
        args: MessageFindManyInterface,
        otherOpt: Omit<FindManyOptions<Messages>, "where">
    ): Promise<Messages[]> {
        if (!otherOpt.take) otherOpt.take = DEFAULT_TAKE_MESSAGES;
        if (!otherOpt.skip) otherOpt.skip = DEFAULT_SKIP_MESSAGES;

        return await this.repository.find({ where: args, ...otherOpt });
    }

    async delete(id: string): Promise<any> {
        return await this.repository.delete(id);
    }

    async update(args: MessageUpdateInterface): Promise<Messages> {
        return await this.repository.save(args);
    }
}
