import { Inject, UseFilters, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WsResponse
} from "@nestjs/websockets";
import { WsAuthGuard } from "src/auth";
import { ICustomSocket } from "src/common";
import { Comments, Posts } from "src/entity";
import { CommentsService, NotificationEnumType, PostsService } from "src/mysql";
import { Repository } from "typeorm";
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
        private commentsService: CommentsService
    ) {}

    @SubscribeMessage(Events.ADD_ANSWER_COMMENT)
    public async addAnswerToComment(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddAnswerToComment
    ): Promise<WsResponse<Comments>> {
        if (!body.answer.user) {
            body.answer.user = socket.user;
        }

        const comment = await this.commentsService.findOne({id: body.commentId}, {relations: {user: true}})
        const answer = await this.commentsService.create(body.answer)
        
        await this.commentsService.setAnswer(answer, comment)

        const notification = await this.baseGateway.setNotification(
            { from: body.answer.user, to: comment.user, type: NotificationEnumType.ANSWER_COMMENT }
        );
        
        if(notification) {
            this.baseGateway.sendNotification(this.baseGateway.findUser(notification.to.id), notification, answer)
        }

        comment.answers = [answer]

        return {
            event: Events.REFRESH_COMMENT,
            data: comment
        }
    }

    @SubscribeMessage(Events.ADD_COMMENT_POST)
    public async addCommentToPost(
        @MessageBody() body: AddCommentToPostDto,
        @ConnectedSocket() socket: ICustomSocket
    ): Promise<WsResponse<Comments>> {
        if(!body.comment.user) {
            body.comment.user = socket.user
        }

        const post = await this.postsService.findOne({id: body.postId}, {relations: {user: true}})
        const comment = await this.commentsService.create({...body.comment, post})

        await this.postsService.setComment(comment)

        const notfication = await this.baseGateway.setNotification({from: socket.user, to: post.user, type: NotificationEnumType.COMMENT})
        
        if(notfication) {
            this.baseGateway.sendNotification(this.baseGateway.findUser(notfication.to.id), notfication, comment)
        }

        return {
            event: Events.REFRESH_COMMENT,
            data: comment
        }
    }

    @SubscribeMessage(Events.ADD_LIKE_POST)
    public async addLikeToPost(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddLikeToPostDto
    ): Promise<WsResponse<{post: Posts, likeMe: boolean}>> {
        const post = await this.postsService.findOne({id: body.postId}, {relations: {user: true, likes: true}})
        const indexContainsLike = post.likes.findIndex(like => like.id === socket.user.id)

        if(indexContainsLike !== -1) {
            await this.postsService.unsetLike(socket.user, post)
        }
        else {
            await this.postsService.setLike(socket.user, post)

            const notfication = await this.baseGateway.setNotification({from: socket.user, to: post.user, type: NotificationEnumType.LIKE_POST})

            if(notfication) {
                delete post.likes
                this.baseGateway.sendNotification(this.baseGateway.findUser(post.user.id), notfication, post)
            }
        }

        delete post?.likes
        delete post.user

        return {
            event: Events.REFRESH_POST,
            data: {post, likeMe: indexContainsLike === -1}
        }
    }

    @SubscribeMessage(Events.ADD_LIKE_COMMENT)
    public async addLikeToComment(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddLikeToCommentDto
    ): Promise<WsResponse<{comment: Comments, likeMe: boolean}>> {
        const comment = await this.commentsService.findOne({id: body.commentId}, {relations: {user: true, likes: true}})
        const likeContainsIndex = comment.likes.findIndex(like => like.id === socket.user.id)

        if(likeContainsIndex !== -1) {
            await this.commentsService.unsetLike(socket.user, comment)
        }
        else {
            await this.commentsService.setLike(socket.user, comment)

            const notfication = await this.baseGateway.setNotification({from: socket.user, to: comment.user, type: NotificationEnumType.LIKE_COMMENT})
    
            if(notfication) {
                delete comment.likes
                this.baseGateway.sendNotification(this.baseGateway.findUser(comment.user.id), notfication, comment)
            }
        }
        
        return {
            event: Events.REFRESH_COMMENT,
            data: {comment, likeMe: likeContainsIndex !== -1}
        }
    }
}
