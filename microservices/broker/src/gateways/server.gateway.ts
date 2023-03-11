import { Inject, Injectable } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { IncomingMessage } from 'http';
import { SESSION_MODULE_CONFIG } from 'src/app.constants';
import { SessionServiceClient } from 'src/proto/session';
import { ICustomSocket } from './types/socket.type';

@Injectable()
@WebSocketGateway({cors: {origin: "*"}, cookie: true})
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient
    ) {}

    private users: Map<string, Map<string, ICustomSocket>> = new Map()

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