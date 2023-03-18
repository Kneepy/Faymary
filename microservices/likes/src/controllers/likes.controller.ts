import {Controller} from "@nestjs/common";
import {LikesService} from "../providers";
import {Likes, NotFoundFindParams} from "../common";
import {LikesDTO} from "../dtos";
import {LikeStateEnum} from "../common/enums/like-state.enum";
import { LIKES_SERVICE_NAME, SERVICE_METHODS } from "../common";
import {GrpcMethod} from "@nestjs/microservices";

@Controller()
export class LikesController {
    constructor(private likesService: LikesService) {}

    @GrpcMethod(LIKES_SERVICE_NAME, SERVICE_METHODS.ADD_LIKE)
    async addLike(data: LikesDTO.AddLikeDTO): Promise<Likes> {
        const existLike = await this.likesService.findOne({user_id: data.user_id, item_id: data.item_id})

        if(existLike) {
            existLike.state = existLike.state === LikeStateEnum.ACTIVE ? LikeStateEnum.NOT_ACTIVE : LikeStateEnum.ACTIVE

            return await this.likesService.update(existLike)
        } else return await this.likesService.create(data)
    }

    @GrpcMethod(LIKES_SERVICE_NAME, SERVICE_METHODS.GET_COUNT_LIKES)
    async getCountLikes(data: LikesDTO.GetCountLikesDTO): Promise<{count: number}> {
        return {count: await this.likesService.count({type: data.type, item_id: data.item_id})}
    }

    @GrpcMethod(LIKES_SERVICE_NAME, SERVICE_METHODS.CHECK_LIKE)
    async checkLike({user_id, type, item_id}: LikesDTO.CheckLikeDTO): Promise<{isLiked: boolean}> {
        if(!user_id || !type || !item_id) throw NotFoundFindParams

        return {isLiked: !!(await this.likesService.findOne({user_id, type, item_id}))}
    }
}