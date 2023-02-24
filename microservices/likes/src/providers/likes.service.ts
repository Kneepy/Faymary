import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Likes} from "../common/entities";
import {Injectable} from "@nestjs/common";
import {LikeTypes} from "../interfaces";
import {DEFAULT_LIKE_STATE, DEFAULT_SKIP_LIKES, DEFAULT_TAKE_LIKES} from "src/common";
import {LikeStateEnum} from "../common/enums/like-state.enum";

@Injectable()
export class LikesService {
    constructor(@InjectRepository(Likes) private repository: Repository<Likes>) {}

    async create(input: LikeTypes.CreateLikeInterface): Promise<Likes> {
        return await this.repository.save({...input, createdAt: Date.now(), state: DEFAULT_LIKE_STATE})
    }

    async find(args: LikeTypes.FindManyLikesInterface, otherOptions: LikeTypes.FindManyOptionsInterface): Promise<Likes[]> {
        return await this.repository.find({where: {...args, state: args.state ?? DEFAULT_LIKE_STATE}, take: otherOptions.take ?? DEFAULT_TAKE_LIKES, skip: otherOptions.skip ?? DEFAULT_SKIP_LIKES})
    }

    async findOne(args: LikeTypes.FindOneLikeInterface): Promise<Likes> {
        return await this.repository.findOne({where: args})
    }

    async update(data: LikeTypes.UpdateLikeInterface): Promise<Likes> {
        return await this.repository.save(data)
    }

    async delete(id: string): Promise<boolean> {
        const like = await this.findOne({id})

        if(like) {
            like.state = LikeStateEnum.NOT_ACTIVE

            return !!(await this.update(like))
        } else return false
    }
}