import { UseFilters } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { IncomingMessage } from "http";
import { AuthService } from "src/auth";
import type * as WebSocket from "ws"
import { WsExeptionFilter } from "../filters";
import { ICustomSocket } from "../interfaces";

var userKey = null

@WebSocketGateway({cors: {origin: "*"}})
@UseFilters(new WsExeptionFilter())
export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private authService: AuthService
    ) {}

    private users: Map<string, WebSocket.WebSocket> = new Map()

    @UseFilters(new WsExeptionFilter())
    async handleConnection(@ConnectedSocket() socket: ICustomSocket, ...[args]: [IncomingMessage]) {
        //const token = args.headers.authorization?.split(" ")[1] ?? args.headers.authorization
        //socket.id = this.authService.verifyAccessToken(token).userId
        socket.id = args.headers.authorization?.split(" ")[1] ?? args.headers.authorization

        this.users.set(socket.id, socket)
        console.log(this.users.keys())
    }

    handleDisconnect(@ConnectedSocket() socket: ICustomSocket) {
        this.users.delete(socket.id)
        console.log(this.users.keys())
    }

}