import { UseFilters } from '@nestjs/common';
import { COMMENTS_MODULE_CONFIG, MESSAGES_MODULE_CONFIG, NOTIFICATIONS_MODULE_CONFIG, POST_MODULE_CONFIG, PROFILES_MODULE_CONFIG, STORIES_MODULE_CONFIG, USER_MODULE_CONFIG } from '../constants/app.constants';
import { Inject } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WsException, WsResponse } from "@nestjs/websockets";
import { IncomingMessage } from 'http';
import { SESSION_MODULE_CONFIG } from 'src/constants/app.constants';
import { SessionServiceClient } from 'src/proto/session';
import { ICustomSocket } from './types/socket.type';
import { NotificationCreate, NotificationsServiceClient, Notification, NotificationAdditionsEnumType, NotificationEnumType } from 'src/proto/notification';
import { WsExceptionFilter } from './filters/ws-exception.filter';
import { CommentsServiceClient } from 'src/proto/comments';
import { PostServiceClient } from 'src/proto/post';
import { StoriesServiceClient } from 'src/proto/stories';
import { UserServiceClient } from 'src/proto/user';
import { MessagesSerivceClient } from 'src/proto/messages';
import { WEVENTS } from './enums/events.enum';
import { ProfilesServiceClient } from 'src/proto/profiles';
import { GetSettingByNotificationType } from './enums/setting-by-notification-type.enum';
import { map, mergeMap, tap } from 'rxjs/operators';

@WebSocketGateway({ cors: { origin: "*" }, cookie: true })
@UseFilters(WsExceptionFilter)
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient,
        @Inject(NOTIFICATIONS_MODULE_CONFIG.PROVIDER) private notificationsService: NotificationsServiceClient,
        @Inject(COMMENTS_MODULE_CONFIG.PROVIDER) private commentsService: CommentsServiceClient,
        @Inject(POST_MODULE_CONFIG.PROVIDER) private postsService: PostServiceClient,
        @Inject(STORIES_MODULE_CONFIG.PROVIDER) private storiesService: StoriesServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesSerivceClient,
        @Inject(PROFILES_MODULE_CONFIG.PROVIDER) private profileService: ProfilesServiceClient
    ) { }

    private users: Map<string, Map<string, ICustomSocket>> = new Map()

    /**
     * Эта функция сама создаёт уведомления в микросервисе
     */
    async sendNotification(data: NotificationCreate): Promise<boolean> {
        /**
         * Я лично хз норм ли это, но если учитывать что все типы ДОЛЖНЫ\ОБЯЗАНЫ быть одинкаовы для всех микросервисов то норм и возможно нужно будет вынести в отдельую функцию
         * Эта штука перебирает типы того из-за какой записи было отправлено уведомление и передаёт полученную инфу в to_id т.к из-за особенности сей архитектуры нельзя сразу сказать кто создал запись без её получения
         * 
         * В теории можно заменить на:  const a = {...}; a[NotificationAdditionsEnumType.USER] = (...).user_id, но мне лень
        */
        if (data.parent_type && data.parent_id && !data.to_id) {
            switch (data.parent_type) {
                case NotificationAdditionsEnumType.USER as NotificationAdditionsEnumType:
                    data.to_id = (await this.userService.findUser({ id: data.parent_id }).toPromise()).id
                    break
                case NotificationAdditionsEnumType.COMMENT:
                    data.to_id = (await this.commentsService.getComment({ id: data.parent_id }).toPromise()).user_id
                    break
                case NotificationAdditionsEnumType.POST:
                    data.to_id = (await this.postsService.getPost({ id: data.parent_id }).toPromise()).user_id
                    break
                case NotificationAdditionsEnumType.STORY:
                    data.to_id = (await this.storiesService.getStory({ id: data.parent_id }).toPromise()).user_id
                    break
                case NotificationAdditionsEnumType.MESSAGE:
                    data.to_id = (await this.messagesService.getMessage({ id: data.parent_id }).toPromise()).user_id
                    break
            }
        }

        if (data.to_id !== data.from_id) {          
            /**
             * Тут делаем проверку на то хочет ли пользователь получать те или иные уведомления указанные в настройках
             */
            if(data.notification_type in NotificationEnumType) {
                const [to_id_socket] = this.users.get(data.to_id).values()

                if(to_id_socket && !GetSettingByNotificationType(to_id_socket.settings)[data.notification_type]) return false
            }

            return this.broadcastUser<Notification>(data.to_id, { event: WEVENTS.NOTIFICATION, data: await this.notificationsService.createNotification(data).toPromise() })
        }
    }

    /*
        эта штука зменяет нам return из функции т.к пользователь может быть подлюченн к сокетам с разных устройст и об изменениях на одном устройстве должны знать сразу все устройства пользователя
    */
    async broadcastUser<T>(user_id: string, data: WsResponse<T>): Promise<boolean> {
        const wsSessions = this.users.get(user_id)

        if (!wsSessions) return false
        wsSessions.forEach(socket => socket.send(JSON.stringify(data)))

        return true
    }

    async closeConnection(client: ICustomSocket, error: any) {
        error && client.send(JSON.stringify(error))
        client.close()
    }

    async handleConnection(@ConnectedSocket() client: ICustomSocket, ...[args]: [IncomingMessage]) {
        const { session_id, authorization, fingerprint } = args.headers

        // если токены не переданы то закрываем соединение
        if (!authorization || !session_id || !fingerprint) {
            client.close()
            return false
        }

        const access_token = authorization.trim().split(" ")[1] ?? authorization

        /**
         * Для меня не работавшего с RxJS выглядит очень страшно
         * И возможно придётся всё переписывать так как это "первый полёт" в этом направлении
         */
        this.sessionService.generateTokensBySession({
            access_token, refresh_token: session_id as string,
            session: {
                fingerprint: fingerprint as string,
                ua: args.headers["user-agent"],
                ip: (args.socket.remoteAddress || args.headers["x-forwarded-for"]) as string
            }
        }).pipe(
            tap(tokens => client.session_id = tokens.refresh_token),
            mergeMap(tokens => this.sessionService.verifyTokens({ access_token: tokens.access_token, refresh_token: tokens.refresh_token })),
            tap(verifiedToken => client.user_id = verifiedToken.user_id),
            mergeMap(verifiedToken => {
                client.user_id = verifiedToken.user_id
                return this.profileService.getProfile({ user_id: client.user_id })
            })
        ).subscribe({
            next: profile => {
                if (!this.users.has(client.user_id)) this.users.set(client.user_id, new Map())
        
                client.settings = profile
                this.users.get(client.user_id).set(client.session_id, client)
            },
            error: e => this.closeConnection(client, e)
        })
    }

    handleDisconnect(@ConnectedSocket() client: ICustomSocket) {
        this.users.get(client.user_id)?.delete(client.session_id)
    }
}