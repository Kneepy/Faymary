import { PoorDataError } from './../constants/errors.constants';
import { NOTIFICATIONS_MODULE_CONFIG, PROFILES_MODULE_CONFIG, USER_MODULE_CONFIG } from '../constants/app.constants';
import { Inject } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { IncomingMessage } from 'http';
import { SESSION_MODULE_CONFIG } from 'src/constants/app.constants';
import { SessionServiceClient } from 'src/proto/session';
import { ICustomSocket } from './types/socket.type';
import { NotificationCreate, NotificationsServiceClient, NotificationAdditionsEnumType, NotificationEnumType } from 'src/proto/notification';
import { UserServiceClient } from 'src/proto/user';
import { WEVENTS } from './enums/events.enum';
import { ProfilesServiceClient } from 'src/proto/profiles';
import { GetSettingByNotificationType } from './enums/setting-by-notification-type.enum';
import { mergeMap, tap } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { UtilsService } from 'src/utils/get-item.util';
import { BrokerResponse, Fields } from 'src/types';

@WebSocketGateway({ cors: { origin: "*" }, cookie: true })
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient,
        @Inject(NOTIFICATIONS_MODULE_CONFIG.PROVIDER) private notificationsService: NotificationsServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        @Inject(PROFILES_MODULE_CONFIG.PROVIDER) private profileService: ProfilesServiceClient,
        private utilsService: UtilsService
    ) {}

    private users: Map<string, Map<string, ICustomSocket>> = new Map()

    /**
     * Эта функция сама создаёт уведомления и получает все необходимы данные по id и type и отправляет их клиенту
     */
    async sendNotification(data: NotificationCreate): Promise<boolean> {
        if (data.to_id !== data.from_id) {

            /**
             * Должен принимать строку как id пользователя которому нужно отправить уведомление
             * Впервые работаю на такой конструкции
             * И вообще не знаю норм ли это
             */
            const subjectNotification = new Subject<string>()

            subjectNotification.subscribe({
                next: to_id => {
                    /**
                     * Тут делаем проверку на то хочет ли пользователь получать те или иные уведомления указанные в настройках
                     */
                    if(data.notification_type in NotificationEnumType) {
                        const [to_id_socket] = this.users.get(to_id)?.values() ?? []

                        if(to_id_socket && !GetSettingByNotificationType(to_id_socket.settings)[data.notification_type]) return false
                    }
                    this.notificationsService.createNotification({...data, to_id: null}).subscribe({
                        next: notification => {
                            forkJoin({
                                parent: this.utilsService.getItem<any>(notification.parent_type, notification.parent_id).data,
                                item: this.utilsService.getItem<any>(notification.type, notification.item_id).data,
                                to: this.userService.findUser({id: notification.to_id}),
                                from: this.userService.findUser({id: notification.from_id})
                            }).subscribe({
                                next: ({parent, item, to, from}) => {
                                    this.broadcastUser<BrokerResponse.Notification>(to_id, { event: WEVENTS.NOTIFICATION, data: {...notification, parent, item, to, from}})
                                }
                            })
                        },
                        /**
                         * Я хз как обработать эту ошибку, клиент о ней знать вообще не должен по идее
                         */
                        error: e => e
                    })
                }
            })

            /**
             * Я лично хз норм ли это, но если учитывать что все типы ДОЛЖНЫ\ОБЯЗАНЫ быть одинкаовы для всех микросервисов то норм и возможно нужно будет вынести в отдельую функцию
             * Эта штука перебирает типы того из-за какой записи было отправлено уведомление и передаёт полученную инфу в to_id т.к из-за особенности сей архитектуры нельзя сразу сказать кто создал запись без её получения
             * 
             * В теории можно заменить на:  const a = {...}; a[NotificationAdditionsEnumType.USER] = (...).user_id, но мне лень
            */
            if (data.parent_type in NotificationAdditionsEnumType && data.parent_id && !data.to_id) {
                const parent = this.utilsService.getItem(data.parent_type, data.parent_id)

                parent.data.subscribe({
                    next: item => subjectNotification.next(parent.key === Fields.USER ? item.id : item.user_id),
                    error: e => e
                })
            } else subjectNotification.next(data.to_id)

            subjectNotification.complete()

            return true
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

    async sendUser<T>(client: ICustomSocket, data: WsResponse<T>) {
        client.send(JSON.stringify(data))
    }

    async sendError(client: ICustomSocket, error: any) {
        client.send(JSON.stringify({data: error, event: WEVENTS.ERROR}))
    }

    async handleConnection(@ConnectedSocket() client: ICustomSocket, ...[args]: [IncomingMessage]) {
        const { session_id, authorization, fingerprint } = args.headers

        // если токены не переданы то закрываем соединение
        if (!authorization || !session_id || !fingerprint) {
            this.sendError(client, PoorDataError) 
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
            tap(tokens => {
                client.session_id = tokens.refresh_token
                this.sendUser<string>(client, {event: WEVENTS.SESSION_TOKEN, data: client.session_id})
            }),
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
            error: e => {
                this.sendError(client, e) && client.close()
            }
        })
    }

    handleDisconnect(@ConnectedSocket() client: ICustomSocket) {
        this.users.get(client.user_id)?.delete(client.session_id)
    }
}