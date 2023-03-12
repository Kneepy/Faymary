import { WebSocketGateway } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { StoriesServiceClient } from 'src/proto/stories';
import { STORIES_MODULE_CONFIG } from 'src/constants/app.constants';
import { PostServiceClient } from './../proto/post';
import { COMMENTS_MODULE_CONFIG, POST_MODULE_CONFIG } from '../constants/app.constants';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Inject, Injectable } from '@nestjs/common';
import { CommentsServiceClient, CreateCommentDTO, UpdateCommentDTO, CommentType } from 'src/proto/comments';
import { ICustomSocket } from './types/socket.type';
import { WEVENTS } from './enums/events.enum';
import { ServerGateway } from './server.gateway';
import { NotificationCreate, NotificationEnumType } from 'src/proto/notification';
import { WsExceptionFilter } from './filters/ws-exception.filter';

@Injectable()
@UseFilters(WsExceptionFilter)
@WebSocketGateway()
export class CommentsGateway {
    constructor(
        @Inject(COMMENTS_MODULE_CONFIG.PROVIDER) private commentsService: CommentsServiceClient,
        @Inject(POST_MODULE_CONFIG.PROVIDER) private postsService: PostServiceClient,
        @Inject(STORIES_MODULE_CONFIG.PROVIDER) private storiesService: StoriesServiceClient,
        private serverGateway: ServerGateway
    ) {}

    @SubscribeMessage(WEVENTS.COMMENTS.CREATE)
    async createComment(@MessageBody() data: Omit<CreateCommentDTO, "user_id">, @ConnectedSocket() {user_id}: ICustomSocket): Promise<void> {
        const comment = await this.commentsService.createComment({...data, user_id}).toPromise()
        const notificationData: NotificationCreate = {from_id: user_id, type: NotificationEnumType.COMMENT, item_id: comment.id, to_id: null}

        switch (comment.type) {
            case CommentType.COMMENT: 
                notificationData.to_id = (await this.commentsService.getComment({id: comment.item_id}).toPromise()).user_id
                break
            case CommentType.POST: 
                notificationData.to_id = (await this.postsService.getPost({id: comment.item_id}).toPromise()).user_id
                break
            case CommentType.STORY: 
                notificationData.to_id = (await this.storiesService.getStory({id: comment.item_id}).toPromise()).user_id
                break
        }

        this.serverGateway.sendNotification(notificationData, WEVENTS.NOTIFICATIONS_TYPE.CREATE_COMMENT)
        this.serverGateway.broadcastUser(user_id, {
            event: WEVENTS.COMMENTS.CREATE, 
            data: comment
        })
    }

    @SubscribeMessage(WEVENTS.COMMENTS.UPDATE)
    async updateComment(@MessageBody() data: Omit<UpdateCommentDTO, "user_id">, @ConnectedSocket() {user_id}: ICustomSocket): Promise<void> {
        const comment = await this.commentsService.updateComment({...data, user_id}).toPromise()

        this.serverGateway.broadcastUser(user_id, {
            event: WEVENTS.COMMENTS.UPDATE, 
            data: comment
        })
    }
}