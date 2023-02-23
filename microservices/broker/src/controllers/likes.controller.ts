import { Controller, Get, Inject } from "@nestjs/common";
import {Like, LikesServiceClient, LikeType} from "src/proto/likes";
import {LIKES_MODULE_CONFIG} from "../app.constants";

@Controller()
export class LikesController {
    constructor(
        @Inject(LIKES_MODULE_CONFIG.PROVIDER) private likesService: LikesServiceClient
    ) {}

    @Get("/")
    async addLike(): Promise<Like> {
        return await this.likesService.addLike({type: LikeType.COMMENT, item_id: "ewfwef", user_id: "fwfe"}).toPromise()
    }
}