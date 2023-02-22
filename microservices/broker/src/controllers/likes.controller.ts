import { Controller, Get, Inject } from "@nestjs/common";
import { LikesClient } from "src/clients/likes.client";
import {Like, LikesServiceClient, LikeType} from "src/proto/likes";

@Controller()
export class LikesController {
    constructor(
        private likesClient: LikesClient,
        @Inject("LIKES_SERVICE") private likesService: LikesServiceClient
    ) {}

    @Get("/")
    async addLike(): Promise<Like> {
        return await this.likesService.addLike({type: LikeType.COMMENT, item_id: "ewfwef", user_id: "fwfe"}).toPromise()
    }
}