import { WebSocketGateway } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { COMMENTS_MODULE_CONFIG } from '../constants/app.constants';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { CommentsServiceClient, CreateCommentDTO, UpdateCommentDTO, Comment } from 'src/proto/comments';
import { ICustomSocket } from './types/socket.type';
import { WEVENTS } from './enums/events.enum';
import { ServerGateway } from './server.gateway';
import { NotificationAdditionsEnumType, NotificationEnumType } from 'src/proto/notification';
import { WsExceptionFilter } from './filters/ws-exception.filter';

@UseFilters(WsExceptionFilter)
@WebSocketGateway() 
export class CommentsGateway {
    constructor(
        @Inject(COMMENTS_MODULE_CONFIG.PROVIDER) private commentsService: CommentsServiceClient,
        private serverGateway: ServerGateway
    ) {}

    @SubscribeMessage(WEVENTS.COMMENTS.CREATE)
    async createComment(@MessageBody() data: Omit<CreateCommentDTO, "user_id">, @ConnectedSocket() {user_id}: ICustomSocket): Promise<void> {
        const comment = await this.commentsService.createComment({...data, user_id}).toPromise()

        /**
         * Могу себе позволить создавать такие штуки т.к все enum'ы типов записей (post, user, story и т.п) должны быть одинаковыми на всех микросервисах
         */
        this.serverGateway.sendNotification({
            from_id: user_id, 
            type: NotificationAdditionsEnumType.COMMENT, 
            item_id: comment.id, 
            to_id: null, 
            parent_type: comment.type as any, 
            parent_id: comment.item_id,
            notification_type: NotificationEnumType.ADD_COMMENT
        }, WEVENTS.NOTIFICATIONS_TYPE.CREATE_COMMENT)
        this.serverGateway.broadcastUser<Comment>(user_id, {
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