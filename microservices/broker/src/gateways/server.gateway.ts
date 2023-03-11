import { WEVENTS } from './events.enum';
import { NOTIFICATIONS_MODULE_CONFIG } from './../app.constants';
import { Inject, Injectable } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { IncomingMessage } from 'http';
import { SESSION_MODULE_CONFIG } from 'src/app.constants';
import { SessionServiceClient } from 'src/proto/session';
import { ICustomSocket } from './types/socket.type';
import { NotificationCreate, NotificationsServiceClient, Notification } from 'src/proto/notification';

@Injectable()
@WebSocketGateway({cors: {origin: "*"}, cookie: true})
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient,
        @Inject(NOTIFICATIONS_MODULE_CONFIG.PROVIDER) private notificationsService: NotificationsServiceClient
    ) {}

    private users: Map<string, Map<string, ICustomSocket>> = new Map()

    async sendNotification(data: NotificationCreate, event: string): Promise<boolean> {
        return this.broadcastUser<Notification>(data.to_id, {event, data: await this.notificationsService.createNotification(data).toPromise()})
    }


    // эта штука зменяет нам return из функции т.к пользователь может быть подлюченн к сокетам с разных устройст и об изменениях на одном устройстве должны знать сразу все устройства пользователя
    async broadcastUser<T>(user_id: string, data: WsResponse<T>): Promise<boolean> {
        const wsSessions = this.users.get(user_id)

        if(!wsSessions) return false
        wsSessions.forEach(socket => socket.send(JSON.stringify(data)))

        return true
    }

    async handleConnection(@ConnectedSocket() client: ICustomSocket, ...[args]: [IncomingMessage]) {
        const {session_id, authorization, fingerprint} = args.headers
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
        this.users.get(client.user_id).delete(client.session_id)
    }
}