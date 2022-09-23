import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "src/entity";
import { Comments } from "src/entity/posts/comments.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { CommentsArgs, CommentsInput } from "../dto";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments) private repository: Repository<Comments>
    ) {}

    public async setAnswer(answer: Comments, on: Comments) {
        await this.repository.createQueryBuilder().relation(Comments, "answers").of(on).add(answer)
    }

    public async findOne(
        args: CommentsArgs,
        options?: FindOneOptions<Comments>
    ): Promise<Comments> {
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }
    public async find(
        args: CommentsArgs,
        options?: FindManyOptions<Comments>
    ): Promise<Comments[]> {
        return await this.repository.find({
            where: args,
            ...options
        });
    }

    public async update(args: Comments): Promise<Comments> {
        return await this.repository.save(args);
    }

    public async create(args: CommentsInput): Promise<Comments> {
        return await this.repository.save({ ...args, createdAt: Date.now() });
    }

    public async remove(uuid: string): Promise<any> {
        return await this.repository.delete(uuid);
    }
}
