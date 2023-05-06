import { Controller, Get, Inject, Query, Req } from "@nestjs/common";
import { LIKES_MODULE_CONFIG } from "src/constants/app.constants";
import { DisableAuth } from "src/disable-auth.decorator";
import { CheckLikeDTO, CountLikes, GetCountLikesDTO, IsLiked, LikesServiceClient } from "src/proto/likes";
import { ICustomRequest } from "src/types/request.type";

@Controller("likes")
export class LikesController {
    constructor(
        @Inject(LIKES_MODULE_CONFIG.PROVIDER) private likesService: LikesServiceClient,
    ) {}

    @Get()
    @DisableAuth()
    async getCountLikes(@Query() data: GetCountLikesDTO): Promise<CountLikes> {
        return await this.likesService.getCountLikes(data).toPromise()
    }

    @Get("check")
    async checkLike(@Query() data: Omit<CheckLikeDTO, "user_id">, @Req() {user_id}: ICustomRequest): Promise<IsLiked> {
        return await this.likesService.checkLike({user_id, ...data}).toPromise()
    }
}