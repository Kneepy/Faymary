import { UseFilters } from '@nestjs/common';
import { COMMENTS_MODULE_CONFIG, NOTIFICATIONS_MODULE_CONFIG, POST_MODULE_CONFIG, STORIES_MODULE_CONFIG, USER_MODULE_CONFIG } from '../constants/app.constants';
import { Inject, Injectable } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WsException, WsResponse } from "@nestjs/websockets";
import { IncomingMessage } from 'http';
import { SESSION_MODULE_CONFIG } from 'src/constants/app.constants';
import { SessionServiceClient } from 'src/proto/session';
import { ICustomSocket } from './types/socket.type';
import { NotificationCreate, NotificationsServiceClient, Notification, NotificationEnumType } from 'src/proto/notification';
import { WsExceptionFilter } from './filters/ws-exception.filter';
import { CommentsServiceClient } from 'src/proto/comments';
import { PostServiceClient } from 'src/proto/post';
import { StoriesServiceClient } from 'src/proto/stories';
import { UserServiceClient } from 'src/proto/user';

@WebSocketGateway({cors: {origin: "*"}, cookie: true})
@UseFilters(WsExceptionFilter)
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient,
        @Inject(NOTIFICATIONS_MODULE_CONFIG.PROVIDER) private notificationsService: NotificationsServiceClient,
        @Inject(COMMENTS_MODULE_CONFIG.PROVIDER) private commentsService: CommentsServiceClient,
        @Inject(POST_MODULE_CONFIG.PROVIDER) private postsService: PostServiceClient,
        @Inject(STORIES_MODULE_CONFIG.PROVIDER) private storiesService: StoriesServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient
    ) {}

    private users: Map<string, Map<string, ICustomSocket>> = new Map()


    /**
     * Эта функция сама создаёт уведомления в микросервисе
     */
    async sendNotification(data: NotificationCreate, event: string): Promise<boolean> {
        /**
         * Я лично хз норм ли это, но если учитывать что все типы ДОЛЖНЫ\ОБЯЗАНЫ быть одинкаовы для всех микросервисов то норм и возможно нужно будет вынести в отдельую функцию
         * Эта штука перебирает типы того из-за какой записи было отправлено уведомление и передаёт полученную инфу в to_id т.к из-за особенности сей архитектуры нельзя сразу сказать кто создал запись без её получения
        */
        if(data.parent_type && data.parent_id && !data.to_id) {
            switch (data.parent_type) {
                case NotificationEnumType.COMMENT: 
                    data.to_id = (await this.commentsService.getComment({id: data.parent_id}).toPromise()).user_id
                    break
                case NotificationEnumType.POST: 
                    data.to_id = (await this.postsService.getPost({id: data.parent_id}).toPromise()).user_id
                    break
                case (NotificationEnumType.USER) as NotificationEnumType: 
                    data.to_id = (await this.userService.findUser({id: data.parent_id}).toPromise()).id
                    break
                case NotificationEnumType.STORY: 
                    data.to_id = (await this.storiesService.getStory({id: data.parent_id}).toPromise()).user_id
                    break
            }
        }

        if(data.to_id !== data.from_id) {
            return this.broadcastUser<Notification>(data.to_id, {event, data: await this.notificationsService.createNotification(data).toPromise()})
        }
    }

    /*
        эта штука зменяет нам return из функции т.к пользователь может быть подлюченн к сокетам с разных устройст и об изменениях на одном устройстве должны знать сразу все устройства пользователя
    */
    async broadcastUser<T>(user_id: string, data: WsResponse<T>): Promise<boolean> {
        const wsSessions = this.users.get(user_id)

        if(!wsSessions) return false
        wsSessions.forEach(socket => socket.send(JSON.stringify(data)))

        return true
    }

    async handleConnection(@ConnectedSocket() client: ICustomSocket, ...[args]: [IncomingMessage]) {
        const {session_id, authorization, fingerprint} = args.headers

        // если токены не переданы то закрываем соединение
        if(!authorization || !session_id || !fingerprint) {
            client.close()
            return false
        }

        const access_token = authorization.trim().split(" ")[1] ?? authorization  
        const tokens = await this.sessionService.generateTokensBySession({
            access_token, refresh_token: session_id as string,
            session: {
                fingerprint: fingerprint as string, 
                ua: args.headers["user-agent"],
                ip: (args.socket.remoteAddress || args.headers["x-forwarded-for"]) as string
            }
        }).toPromise()
        const verifedTokens = await this.sessionService.verifyTokens({access_token: tokens.access_token, refresh_token: tokens.refresh_token}).toPromise()
        
        if(!this.users.has(verifedTokens.user_id)) this.users.set(verifedTokens.user_id, new Map())

        client.session_id = tokens.refresh_token
        client.user_id = verifedTokens.user_id
        this.users.get(verifedTokens.user_id).set(tokens.refresh_token, client)  
    }

    handleDisconnect(@ConnectedSocket() client: ICustomSocket) {
        this.users.get(client.user_id)?.delete(client.session_id)
    }
}