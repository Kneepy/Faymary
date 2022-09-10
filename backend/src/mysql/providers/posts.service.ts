import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "src/entity/posts/post.entity";
import { FindOneOptions, Repository } from "typeorm";
import { PostsArgs, PostsInput } from "../dto";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) private repository: Repository<Posts>
    ) {}

    public async findOne(
        args: PostsArgs,
        options?: FindOneOptions<Posts>
    ): Promise<Posts> {
        return await this.repository.findOne({
            where: args,
            ...options
        });
    }

    public async update(args: Posts): Promise<Posts> {
        return await this.repository.save(args);
    }

    public async create(args: PostsInput): Promise<Posts> {
        return await this.repository.save({ ...args, createdAt: Date.now() });
    }

    public async remove(uuid: string): Promise<any> {
        return await this.repository.delete(uuid);
    }
}
