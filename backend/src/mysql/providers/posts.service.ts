import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments, Likes } from "src/entity";
import { Posts } from "src/entity/posts/post.entity";
import { FindOneOptions, Repository } from "typeorm";
import { PostsArgs, PostsInput } from "../dto";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) private repository: Repository<Posts>
    ) {}

    public async setComment(comment: Comments) {
        await this.repository.createQueryBuilder().relation(Posts, "comments").of(comment.post).add(comment)
    }

    public async setLike(like: Likes, post: Posts) {
        await this.repository.createQueryBuilder().relation(Posts, "likes").of(post).add(like)
    }

    public async unsetLike(like: Likes, post: Posts) {
        await this.repository.createQueryBuilder().relation(Posts, "likes").of(post).remove(like)
    }

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
