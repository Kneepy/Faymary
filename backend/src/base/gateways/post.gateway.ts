import { UseFilters, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { WsAuthGuard } from "src/auth";
import { ICustomSocket } from "src/common";
import { NotificationEnumType, NotificationsService, PostsService, UsersService } from "src/mysql";
import { AddCommentToPostDto } from "../dto/posts";
import { Events } from "../enums";
import { WsExeptionFilter } from "../filters";
import { BaseGateway } from "./base.gateway";

@WebSocketGateway()
@UseFilters(WsExeptionFilter)
@UseGuards(WsAuthGuard)
export class PostGateway {
    constructor(
        private postsService: PostsService,
        private notificationService: NotificationsService,
        private baseGateway: BaseGateway,
        private usersService: UsersService
    ) {}

    @SubscribeMessage(Events.ADD_COMMENT_POST)
    public async addCommentToPost(
        @MessageBody() body: AddCommentToPostDto,
        @ConnectedSocket() socket: ICustomSocket
    ): Promise<WsResponse<any>> {
        const post = await this.postsService.findOne({id: body.postId}, {relations: ["comments", "user", "user.settings", "user.notifications"]})
        const user = await this.usersService.findOne({id: socket.id})

        post.comments.push(body.comment)

        if(post.user.settings.commentsOnPostNotifications) {
            const notification = await this.notificationService.create({
                user: post.user,
                sender: user,
                type: NotificationEnumType.COMMENT
            })
            post.user.notifications.push(notification)
        }

        const updatedPost = await this.postsService.update(post)
        const creatorPostSocket = await this.baseGateway.findUser(post.user.id)

        if(creatorPostSocket) {
            creatorPostSocket.send(JSON.stringify({
                event: Events.REFRESH_USER,
                data: updatedPost.user
            }))
        }

        delete updatedPost.user
        
        return {data: updatedPost, event: Events.REFRESH_USER}
    }
}
