import { Controller } from "@nestjs/common";
import { LikesService } from "../providers";
import { LikesCollection } from "../common";
import { LIKES_SERVICE_NAME, SERVICE_METHODS } from "../common";
import { GrpcMethod } from "@nestjs/microservices";
import { AddLikeDTO, CheckLikeDTO, CreateCollectionDTO, GetCollectionDTO } from "../proto/likes";

@Controller()
export class LikesController {
    constructor(private likesService: LikesService) {}

    @GrpcMethod(LIKES_SERVICE_NAME, SERVICE_METHODS.ADD_LIKE)
    async addLike({ user_id, collection_id }: AddLikeDTO): Promise<LikesCollection> {
        return this.likesService.addLike({ user_id, collection_id })
    }

    @GrpcMethod(LIKES_SERVICE_NAME, SERVICE_METHODS.CHECK_LIKE)
    async checkLike({ user_id, collection_id }: CheckLikeDTO): Promise<{ has_liked: boolean }> {
        return {
            has_liked: await this.likesService.checkLike({ user_id, collection_id })
        }
    }

    @GrpcMethod(LIKES_SERVICE_NAME, SERVICE_METHODS.GET_COLLECTION)
    async getCollection({ id }: GetCollectionDTO): Promise<LikesCollection> {
        return this.likesService.getCollection({ collection_id: id })
    }

    @GrpcMethod(LIKES_SERVICE_NAME, SERVICE_METHODS.CREATE_COLLECTION)
    async createCollection({ unity }: CreateCollectionDTO): Promise<LikesCollection> {
        return this.likesService.createCollection({ unity })
    }
}