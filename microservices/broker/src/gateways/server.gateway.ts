import { Injectable } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { IncomingMessage } from 'http';
import { WebSocket } from "ws"

@Injectable()
@WebSocketGateway({cors: {origin: "*"}, cookie: true})
export class ServerGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor() {}

    private users: Map<string, Map<string, string>> = new Map()

    @SubscribeMessage("fwe")
    g() {
        console.log("2")
    }

    handleConnection(@ConnectedSocket() client: WebSocket, ...[args]: [IncomingMessage]) {
        console.log(args.headers.session_id)
    }
    handleDisconnect(client: any) {
        
    }
}