import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, LikesCollection, NotFoundCollection, LikeStateEnum } from "../common";
import { Injectable } from "@nestjs/common";
import { LikesServiceTypes } from "../types";

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like) private likesRepository: Repository<Like>,
        @InjectRepository(LikesCollection) private likesCollectionRepository: Repository<LikesCollection>,
    ) {}

    async addLike({ user_id, collection_id }: LikesServiceTypes.AddLike): Promise<LikesCollection> {
        const collection = await this.likesCollectionRepository.findOne({where: { id: collection_id }})

        if (!collection) throw NotFoundCollection

        const like = await this.likesRepository.findOne({where: { user_id, collection: { id: collection_id } }, relations: {collection: true}})

        if (!like) {
            const newLike = await this.likesRepository.save({
                user_id,
                state: LikeStateEnum.ACTIVE,
                createdAt: Date.now(),
                collection: collection
            })
            newLike.collection.number_likes++

            await this.likesRepository.save(newLike)
        }
        else {
            like.collection.number_likes += (like.state === LikeStateEnum.ACTIVE ? -1 : 1)
            like.state = (like.state === LikeStateEnum.ACTIVE ? LikeStateEnum.NOT_ACTIVE : LikeStateEnum.ACTIVE)

            await this.likesRepository.save(like)
        }
         return await this.likesCollectionRepository.findOneBy({ id: collection_id })
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