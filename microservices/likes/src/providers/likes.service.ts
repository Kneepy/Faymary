import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, LikesCollection, NotFoundCollection } from "../common";
import { Injectable } from "@nestjs/common";
import { LikesServiceTypes } from "../types";
import { LikeStateEnum } from "../common/enums/like-state.enum";

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like) private likesRepository: Repository<Like>,
        @InjectRepository(LikesCollection) private likesCollectionRepository: Repository<LikesCollection>,
    ) {}

    async addLike({ user_id, collection_id }: LikesServiceTypes.AddLike): Promise<LikesCollection> {

        const collection = await this.likesCollectionRepository.findOneBy({ id: collection_id })

        if (!collection) throw NotFoundCollection

        const like = await this.likesRepository.findOneBy({ user_id, collection: { id: collection_id } })

        if (!like) {
            await this.likesRepository.save({
                user_id,
                state: LikeStateEnum.ACTIVE,
                createdAt: Date.now(),
                collection: { id: collection_id }
            })
            collection.number_likes++
            return await this.likesCollectionRepository.save(collection)
        }
        else {
            like.state = like.state === LikeStateEnum.ACTIVE ? LikeStateEnum.NOT_ACTIVE : LikeStateEnum.ACTIVE
            collection.number_likes += like.state === LikeStateEnum.ACTIVE ? -1 : 1
        }

        await this.likesRepository.save(like)
        return await this.likesCollectionRepository.save(collection)
    }

    async checkLike({ user_id, collection_id }: LikesServiceTypes.CheckLike): Promise<boolean> {

        const like = await this.likesRepository.findOneBy({ user_id, collection: { id: collection_id } })

        return like?.state === LikeStateEnum.ACTIVE

    }

    async createCollection({ unity }: LikesServiceTypes.CreateCollection): Promise<LikesCollection> {

        return this.likesCollectionRepository.save({ unity, number_likes: 0 })

    }

    async getCollection({ collection_id }: LikesServiceTypes.GetCollection): Promise<LikesCollection> {

        return this.likesCollectionRepository.findOneBy({ id: collection_id })

    }
}