import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { DEFAULT_SKIP_POSTS, DEFAULT_TAKE_POSTS } from "./constants";
import { Posts } from "./entities";
import { PostCreationData, PostUpdateData, FindPostCriteria } from "./interfaces";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts) private repository: Repository<Posts> 
    ) {}

    async findOne(where: FindOptionsWhere<FindPostCriteria>, otherOptions?: Omit<FindOneOptions<Posts>, "where">): Promise<Posts> {
        return await this.repository.findOne({where, ...otherOptions})
    }

    async find(where: FindOptionsWhere<FindPostCriteria>, otherOptions: Omit<FindManyOptions<Posts>, "where"> = {take: DEFAULT_TAKE_POSTS, skip: DEFAULT_SKIP_POSTS}): Promise<Posts[]> {
        // костыль но хз как сделать по другому
        Object.keys(where).forEach(key => (key === "take" || key === "skip") && delete where[key])

        return await this.repository.find({where, ...otherOptions})
    }

    async create(post: PostCreationData): Promise<Posts> {
        return await this.repository.save({...post, createdAt: Date.now()})
    }

    async update(user: PostUpdateData): Promise<Posts> {
        return await this.repository.save(user)
    }

    async delete(id: string): Promise<any> {
        return await this.repository.delete(id)
    }

    getFileIds(file_ids: string): string[] {
        return file_ids.split(",")
    }

    joinFileIds(file_ids: string[]): string {
        return file_ids.join(",")
    }
}