import { WebSocketGateway } from '@nestjs/websockets';
import { COMMENTS_MODULE_CONFIG } from '../constants/app.constants';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { CommentsServiceClient, CreateCommentDTO, UpdateCommentDTO, Comment } from 'src/proto/comments';
import { ICustomSocket } from './types/socket.type';
import { WEVENTS } from './enums/events.enum';
import { ServerGateway } from './server.gateway';
import { NotificationAdditionsEnumType, NotificationEnumType } from 'src/proto/notification';

@WebSocketGateway() 
export class CommentsGateway {
    constructor(
        @Inject(COMMENTS_MODULE_CONFIG.PROVIDER) private commentsService: CommentsServiceClient,
        private serverGateway: ServerGateway
    ) {}

    @SubscribeMessage(WEVENTS.COMMENTS.CREATE)
    async createComment(@MessageBody() data: Omit<CreateCommentDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        this.commentsService.createComment({...data, user_id: client.user_id}).subscribe({
            next: comment => {
                /**
                 * Могу себе позволить создавать такие штуки т.к все enum'ы типов записей (post, user, story и т.п) должны быть одинаковыми на всех микросервисах
                 * Описаны в папке docs item_types.md
                 */
                this.serverGateway.sendNotification({
                    from_id: client.user_id, 
                    type: NotificationAdditionsEnumType.COMMENT, 
                    item_id: comment.id, 
                    to_id: null, 
                    parent_type: comment.type as any, 
                    parent_id: comment.item_id,
                    notification_type: NotificationEnumType.ADD_COMMENT
                })
                this.serverGateway.broadcastUser<Comment>(client.user_id, {
                    event: WEVENTS.COMMENTS.CREATE, 
                    data: comment
                })
            },
            error: e => this.serverGateway.sendError(client, e)
        })
    }

    @SubscribeMessage(WEVENTS.COMMENTS.UPDATE)
    async updateComment(@MessageBody() data: Omit<UpdateCommentDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        this.commentsService.updateComment({...data, user_id: client.user_id}).subscribe({
            /**
             * Ну тут мне кажется что обновлённый комментарий нужно возвращать только отправителю
             */
            next: comment =>  this.serverGateway.broadcastUser(client.user_id, {
                event: WEVENTS.COMMENTS.UPDATE, 
                data: comment
            })
        })
    }
}