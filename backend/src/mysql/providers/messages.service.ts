import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Messages, Posts } from "src/entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { ManyMessagesArgs, MessagesArgs, MessagesInput } from "../dto";

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Messages) private repository: Repository<Messages>
    ) {}

    public async addAnswer(message: Messages, answer: Messages) {
        await this.repository
            .createQueryBuilder()
            .relation(Messages, "answerTo")
            .of(message)
            .add(answer);
    }

    public async findOne(
        args: MessagesArgs,
        options?: FindOneOptions<Messages>
    ): Promise<Messages> {
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }

    public async find(
        args: ManyMessagesArgs,
        options?: FindManyOptions<Messages>
    ): Promise<Messages[]> {
        return await this.repository.find({
            where: args,
            ...options
        });
    }

    public async create(input: MessagesInput): Promise<Messages> {
        return await this.repository.save(input);
    }

    async save(message: Messages) {
        return await this.repository.save(message);
    }

    public async delete(id: string): Promise<any> {
        return await this.repository.delete(id);
    }
}
