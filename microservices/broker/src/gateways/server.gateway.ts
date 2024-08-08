import { PoorDataError } from '../constants/errors.constants';
import { NOTIFICATIONS_MODULE_CONFIG, PROFILES_MODULE_CONFIG, USER_MODULE_CONFIG } from '../constants/app.constants';
import { Inject, Query } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { IncomingMessage } from 'http';
import { SESSION_MODULE_CONFIG } from 'src/constants/app.constants';
import { SessionServiceClient } from 'src/proto/session';
import { ICustomSocket } from './types/socket.type';
import { NotificationCreate, NotificationsServiceClient, NotificationAdditionsEnumType, NotificationEnumType } from 'src/proto/notification';
import { UserServiceClient } from 'src/proto/user';
import { WEVENTS } from './enums/events.enum';
import { ProfilesServiceClient } from 'src/proto/profiles';
import { mergeMap, tap } from 'rxjs/operators';
import * as url from "node:url";

@WebSocketGateway({ cors: { origin: "*" }, cookie: true })
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient,
        @Inject(NOTIFICATIONS_MODULE_CONFIG.PROVIDER) private notificationsService: NotificationsServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        @Inject(PROFILES_MODULE_CONFIG.PROVIDER) private profileService: ProfilesServiceClient,
    ) {}

    private users: Map<string, Map<string, ICustomSocket>> = new Map()

    /**
     * Эта функция сама создаёт уведомления и получает все необходимы данные по id и type и отправляет их клиенту
     */
    async sendNotification(data: NotificationCreate): Promise<boolean> {
        return true
    }

    /*
    * эта штука зменяет нам return из функции т.к пользователь может быть подлюченн к сокетам с разных устройст
    * и об изменениях на одном устройстве должны знать сразу все устройства пользователя
    */
    broadcastUser<T>(user_id: string, data: WsResponse<T>): boolean {
        const wsSessions = this.users.get(user_id)

        if (!wsSessions) return false

        wsSessions.forEach(socket =>
            socket.send(JSON.stringify(data))
        )

        return true
    }

    sendUser<T>(client: ICustomSocket, data: WsResponse<T>) {
        client.send(JSON.stringify(data))
    }

    sendError(client: ICustomSocket, error: any) {
        client.send(JSON.stringify({data: error, event: WEVENTS.ERROR}))
    }

    async handleConnection(@ConnectedSocket() client: ICustomSocket, ...[args]: [IncomingMessage]) {
        /**
         * authorization - access_token
         * session_id - refresh_token
         * fingerprint
         */
        const query = url.parse(args.url, true).query
        const { session_id, authorization, fingerprint } = <{[key: string]: string}> query

        // если токены не переданы то закрываем соединение
        if (![authorization, session_id, fingerprint].every(v => typeof v === "string")) {
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
                this.sendError(client, e)
                client.close()
            }
        })
    }

    handleDisconnect(@ConnectedSocket() client: ICustomSocket) {
        this.users.get(client.user_id)?.delete(client.session_id)
    }
}