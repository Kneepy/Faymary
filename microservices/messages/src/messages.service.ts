import { InjectRepository } from "@nestjs/typeorm";
import {
    MessageCreateInterface,
    MessageFindManyInterface,
    MessageFindOneInterface, MessageGetLastInterface,
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

    async findOne(args: MessageFindOneInterface, otherOpt?: Omit<FindManyOptions<Messages>, "where">): Promise<Messages> {
        return await this.repository.findOne({ where: args, ...otherOpt });
    }

    async find(
        args: MessageFindManyInterface,
        otherOpt?: Omit<FindManyOptions<Messages>, "where">
    ): Promise<Messages[]> {
        if (!otherOpt.take) otherOpt.take = DEFAULT_TAKE_MESSAGES;
        if (!otherOpt.skip) otherOpt.skip = DEFAULT_SKIP_MESSAGES;

        return await this.repository.find({ where: args, ...otherOpt });
    }

    async getLast({ dialog_id }: MessageGetLastInterface, otherOpt?: Omit<FindManyOptions<Messages>, "where" | "order" | "take" | "skip">): Promise<Messages> {
        return (await this.repository.find({ where: { dialog_id }, order: { createdAt: "DESC" }, take: 1, ...otherOpt }))[0]
    }

    async delete(id: string): Promise<any> {
        return await this.repository.delete(id);
    }

    async update(args: MessageUpdateInterface): Promise<Messages> {
        return await this.repository.save(args);
    }
}
