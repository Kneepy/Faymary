import { UseFilters, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { WsAuthGuard } from "src/auth";
import { ICustomSocket } from "src/common";
import { PostsService, UsersService } from "src/mysql";
import { AddCommentToPostDto } from "../dto/posts";
import { Events } from "../enums";
import { WsExeptionFilter } from "../filters";

@WebSocketGateway()
@UseFilters(WsExeptionFilter)
@UseGuards(WsAuthGuard)
export class PostGateway {
    constructor(
        private usersService: UsersService,
        private postsService: PostsService
    ) {}

    @SubscribeMessage(Events.ADD_COMMENT_POST)
    public async addCommentToPost(
        @MessageBody() body: AddCommentToPostDto,
        @ConnectedSocket() socket: ICustomSocket
    ): Promise<WsResponse<any>> {
        const post = await this.postsService.findOne({id: body.postId}, {relations: ["comments"]})
        post.comments.push(body.comment)
        console.log(post)

        return {data: {}, event: ""}
    }
}
