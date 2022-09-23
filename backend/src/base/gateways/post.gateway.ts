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
import { CommentsService, NotificationEnumType, NotificationsService, PostsService, UsersService } from "src/mysql";
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
        private usersService: UsersService,
        private commentsService: CommentsService,
        private notificationsService: NotificationsService
    ) {}

    @SubscribeMessage(Events.ADD_ANSWER_COMMENT)
    public async addAnswerToComment(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddAnswerToComment
    ) {
        const returnedEvent = Events.REFRESH_COMMENT
        const comment = await this.commentsService.findOne(
            { id: body.commentId },
            {
                relations: [
                    "answers",
                    "user",
                    "user.notifications",
                    "user.notifications.sender",
                    "user.settings"
                ]
            }
        );

        if (!body.answer.user) {
            body.answer.user = socket.user;
        }

        comment.answers.push(body.answer);

        const notfication = await this.baseGateway.setNotification(
            NotificationEnumType.ANSWER_COMMENT,
            { from: body.answer.user, to: comment.user },
            comment.user.settings.answersOnCommentNotification
        );

        /*
        const similarNotification = await this.notificationsService.findOne({from: socket.user, type: NotificationEnumType.ANSWER_COMMENT})
        const answer = await this.commentsService.create(body.answer)
        
        if(!similarNotification) {
            const notification = await this.notificationsService.create({to: answer.user, from: socket.user, type: NotificationEnumType.ANSWER_COMMENT})
            const notificationSocket = await this.baseGateway.findUser(notification.to.id)

            await this.usersService.addNotification(notification)
            await this.baseGateway.sendNotification(notificationSocket, notfication, NotificationEnumType.ANSWER_COMMENT)   
        }
        */

        if (notfication) {
            comment.user.notifications.push(notfication);
        }

        const updatedComment = await this.commentsService.update(comment);
        const creatorCommentSocket = await this.baseGateway.findUser(
            updatedComment.user.id
        );

        if (
            creatorCommentSocket &&
            creatorCommentSocket.id !== body.answer.user.id
        ) {
            creatorCommentSocket.send(
                JSON.stringify({
                    event: returnedEvent,
                    data: updatedComment.user
                })
            );
        }

        delete updatedComment.user;

        return {
            event: returnedEvent,
            data: updatedComment
        };
    }

    @SubscribeMessage(Events.ADD_COMMENT_POST)
    public async addCommentToPost(
        @MessageBody() body: AddCommentToPostDto,
        @ConnectedSocket() socket: ICustomSocket
    ): Promise<WsResponse<any>> {
        const returnedEvent = Events.REFRESH_POST
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
        const user = socket.user;

        if (!body.comment.user) {
            body.comment.user = user;
        }

        post.comments.push(body.comment);

        const notification = await this.baseGateway.setNotification(
            NotificationEnumType.COMMENT,
            { to: post.user, from: user },
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
                    event: returnedEvent,
                    data: updatedPost.user
                })
            );
        }

        delete updatedPost.user;

        return { data: updatedPost, event: returnedEvent };
    }

    @SubscribeMessage(Events.ADD_LIKE_POST)
    public async addLikeToPost(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddLikeToPostDto
    ) {
        const returnedEvent = Events.REFRESH_POST
        const user = socket.user;
        const post = await this.postsService.findOne(
            { id: body.postId },
            {
                relations: [
                    "likes",
                    "likes.user",
                    "user",
                    "user.settings",
                    "user.notifications",
                    "user.notifications.sender"
                ]
            }
        );

        const postContainsLike = post.likes.findIndex(
            like => like.user.id === socket.user.id
        );

        if (postContainsLike !== -1) {
            post.likes.splice(postContainsLike, 1);
        } else {
            post.likes.push({ user } as Likes);

            const notification = await this.baseGateway.setNotification(
                NotificationEnumType.LIKE_POST,
                { to: post.user, from: user },
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

        if (creatorPostSocket && creatorPostSocket.id !== socket.user.id) {
            creatorPostSocket.send(
                JSON.stringify({
                    event: returnedEvent,
                    data: updatedPost.user
                })
            );
        }

        delete updatedPost.user;

        return { event: returnedEvent, data: updatedPost };
    }

    @SubscribeMessage(Events.ADD_LIKE_COMMENT)
    public async addLikeToComment(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddLikeToCommentDto
    ) {
        const returnedEvent = Events.REFRESH_COMMENT
        const comment = await this.commentsService.findOne(
            { id: body.commentId },
            {
                relations: [
                    "likes",
                    "user",
                    "user.notifications",
                    "user.notifications.sender",
                    "user.settings"
                ]
            }
        );

        comment.likes.push({ user: socket.user } as Likes);

        const notification = await this.baseGateway.setNotification(
            NotificationEnumType.LIKE_COMMENT,
            { from: socket.user, to: comment.user },
            comment.user.settings.likeOnCommentNotification
        );

        if (notification) {
            comment.user.notifications.push(notification);
        }

        const updatedComment = await this.commentsService.update(comment);
        const creatorCommentSocket = await this.baseGateway.findUser(
            comment.user.id
        );

        if (creatorCommentSocket && creatorCommentSocket.id !== socket.user.id) {
            creatorCommentSocket.send(
                JSON.stringify({
                    event: returnedEvent,
                    data: updatedComment.user
                })
            );
        }

        delete updatedComment.user;

        return {
            event: returnedEvent,
            data: updatedComment
        };
    }
}
