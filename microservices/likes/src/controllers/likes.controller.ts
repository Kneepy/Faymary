import {CallHandler, Controller, ExecutionContext, Injectable, NestInterceptor, UseInterceptors} from "@nestjs/common";
import {LikesService} from "../providers";
import {Likes} from "../common";
import {LikesDTO} from "../dtos";
import {LikeStateEnum} from "../common/enums/like-state.enum";
import { LIKES_SERVICE_NAME, SERVICE_METHODS } from "../common";
import {GrpcMethod} from "@nestjs/microservices";
import { map, Observable } from "rxjs";

@Injectable()
class inter implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(map(async data => await data))
    }
}

@Controller()
@UseInterceptors(inter)
export class LikesController {
    constructor(private likesService: LikesService) {}

    @GrpcMethod(LIKES_SERVICE_NAME, SERVICE_METHODS.ADD_LIKE)
    async addLike(data: LikesDTO.AddLikeDTO): Promise<Likes> {
        console.log(data)
        const existLike = await this.likesService.findOne({user_id: data.user_id, item_id: data.item_id})

        if(existLike) {
            existLike.state = existLike.state === LikeStateEnum.ACTIVE ? LikeStateEnum.NOT_ACTIVE : LikeStateEnum.ACTIVE
            console.log(existLike)
            return await this.likesService.update(existLike)
        } else return await this.likesService.create(data)
    }
}