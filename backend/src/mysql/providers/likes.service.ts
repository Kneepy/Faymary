import { InjectRepository } from "@nestjs/typeorm";
import { Likes } from "src/entity";
import { FindOneOptions, Repository } from "typeorm";
import { LikesArgs, LikesInput } from "../dto/likes";

export class LikesService {
    constructor(
        @InjectRepository(Likes) private repository: Repository<Likes>
    ) {}

    public async findOne(args: LikesArgs, options?: FindOneOptions<Likes>): Promise<Likes> {
        return await this.repository.findOne({where: args, ...options})
    }

    public async create(input: LikesInput): Promise<Likes> {
        return await this.repository.save(input)
    }
}