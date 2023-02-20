import { Controller, Get } from "@nestjs/common";
import { LikesClient } from "src/clients/likes.client";
import {Like, LikeType } from "src/proto/likes";

@Controller()
export class LikesController {
    constructor(private likesClient: LikesClient) {}

    @Get("/")
    async addLike(): Promise<Like> {
        return await this.likesClient.addLike({type: LikeType.COMMENT, item_id: "ewfwef", user_id: "fwfe"}).toPromise()
    }
}