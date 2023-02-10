import {Controller} from "@nestjs/common";
import {LikesService} from "../providers";
import {Likes} from "../common";
import {LikesDTO} from "../dtos";
import {LikeStateEnum} from "../common/enums/like-state.enum";
import { LIKES_SERVICE_NAME, SERVICE_METHODS } from "../common/constants/app.constants";
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
}