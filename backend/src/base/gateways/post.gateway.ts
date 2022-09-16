import { UseFilters, UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WsResponse
} from "@nestjs/websockets";
import { WsAuthGuard } from "src/auth";
import { ICustomSocket } from "src/common";
import { Likes } from "src/entity";
import { NotificationEnumType, PostsService, UsersService } from "src/mysql";
import {
    AddAnswerToComment,
    AddCommentToPostDto,
    AddLikeToCommentDto,
    AddLikeToPostDto
} from "../dto/posts";
import { Events } from "../enums";
import { WsExeptionFilter } from "../filters";
import { BaseGateway } from "./base.gateway";

@WebSocketGateway()
@UseFilters(WsExeptionFilter)
@UseGuards(WsAuthGuard)
export class PostGateway {
    constructor(
        private postsService: PostsService,
        private baseGateway: BaseGateway,
        private usersService: UsersService
    ) {}

    @SubscribeMessage(Events.ADD_ANSWER_COMMENT)
    public async addAnswerToComment(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddAnswerToComment
    ) {}

    @SubscribeMessage(Events.ADD_COMMENT_POST)
    public async addCommentToPost(
        @MessageBody() body: AddCommentToPostDto,
        @ConnectedSocket() socket: ICustomSocket
    ): Promise<WsResponse<any>> {
        const post = await this.postsService.findOne(
            { id: body.postId },
            {
                relations: [
                    "comments",
                    "user",
                    "user.settings",
                    "user.notifications",
                    "user.notifications.sender"
                ]
            }
        );
        const user = await this.usersService.findOne({ id: socket.id });

        if (!body.comment.user) {
            body.comment.user = user;
        }

        post.comments.push(body.comment);

        /*
        if(
            post.user.settings.commentsOnPostNotifications &&
            !post.user.notifications.filter(
                value =>
                    value.expirensIn < Date.now() &&
                    value.sender.id === user.id
            ).length
        ) {
            const notification = await this.notificationService.create({
                user: post.user,
                sender: user,
                type: NotificationEnumType.COMMENT
            })
            post.user.notifications.push(notification)
        }
        */

        const notification = await this.baseGateway.setNotification(
            NotificationEnumType.COMMENT,
            { user: post.user, sender: user },
            post.user.settings.commentsOnPostNotifications
        );

        if (notification) {
            post.user.notifications.push(notification);
        }

        const updatedPost = await this.postsService.update(post);
        const creatorPostSocket = this.baseGateway.findUser(post.user.id);

        if (creatorPostSocket && creatorPostSocket.id !== user.id) {
            creatorPostSocket.send(
                JSON.stringify({
                    event: Events.REFRESH_USER,
                    data: updatedPost.user
                })
            );
        }

        delete updatedPost.user;

        return { data: updatedPost, event: Events.REFRESH_USER };
    }

    @SubscribeMessage(Events.ADD_LIKE_POST)
    public async addLikeToPost(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddLikeToPostDto
    ) {
        const user = await this.usersService.findOne({ id: socket.id });
        const post = await this.postsService.findOne(
            { id: body.postId },
            {
                relations: [
                    "likes",
                    "user",
                    "user.settings",
                    "user.notifications",
                    "user.notifications.sender"
                ]
            }
        );
        const like: Likes | any = { user };
        const postContainsLike = post.likes.findIndex(
            like => like.user.id === socket.id
        );

        if (postContainsLike !== -1) {
            post.likes.splice(postContainsLike, 1);
        } else {
            post.likes.push(like);

            /*
            if(
                post.user.settings.likeOnPostNotifications && 
                !post.user.notifications.filter(
                    value =>
                        value.expirensIn < Date.now() &&
                        value.sender.id === user.id
                ).length
            ) {
                const notification = await this.notificationService.create({
                    user: post.user,
                    sender: user,
                    type: NotificationEnumType.LIKE_POST
                })
                post.user.notifications.push(notification)
            }
            */

            const notification = await this.baseGateway.setNotification(
                NotificationEnumType.LIKE_POST,
                { user: post.user, sender: user },
                post.user.settings.likeOnPostNotifications
            );

            if (notification) {
                post.user.notifications.push(notification);
            }
        }

        const updatedPost = await this.postsService.update(post);
        const creatorPostSocket = await this.baseGateway.findUser(
            updatedPost.user.id
        );

        if (creatorPostSocket && creatorPostSocket.id !== user.id) {
            creatorPostSocket.send(
                JSON.stringify({
                    event: Events.REFRESH_USER,
                    data: updatedPost.user
                })
            );
        }

        delete updatedPost.user;

        return { event: Events.REFRESH_USER, data: updatedPost };
    }

    @SubscribeMessage(Events.ADD_LIKE_COMMENT)
    public async addLikeToComment(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddLikeToCommentDto
    ) {}
}
