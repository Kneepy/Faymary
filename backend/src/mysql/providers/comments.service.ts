import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments } from "src/entity";
import { Repository } from "typeorm";
import { CommentsArgs, CommentsInput, FindOneOptions } from "../dto";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments) private repository: Repository<Comments>
    ) {}

    public async findOne(
        args: CommentsArgs,
        options?: FindOneOptions
    ): Promise<Comments> {
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }
    public async find(
        args: CommentsArgs,
        options?: FindOneOptions
    ): Promise<Comments[]> {
        return await this.repository.find({
            where: args,
            ...options
        })
    }

    public async update(args: Comments): Promise<Comments> {
        return await this.repository.save(args);
    }

    public async create(args: CommentsInput): Promise<Comments> {
        return await this.repository.save({...args, createdAt: Date.now()});
    }

    public async remove(uuid: string): Promise<any> {
        return await this.repository.delete(uuid);
    }
}