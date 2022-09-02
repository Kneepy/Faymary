import { UseFilters, UseGuards } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { IncomingMessage } from "http";
import { AuthService, WsAuthGuard } from "src/auth";
import { ICustomSocket } from "src/common";
import { WsExeptionFilter } from "../filters";

@WebSocketGateway({cors: {origin: "*"}})
@UseFilters(WsExeptionFilter)
@UseGuards(WsAuthGuard)
export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private authService: AuthService
    ) {}

    private users: Map<string, ICustomSocket> = new Map()

    public findUser(socketId: string): ICustomSocket {
        return this.users.get(socketId)
    }

    public setUser(socketId: string, socket: ICustomSocket) {
        return this.users.set(socketId, socket)
    }

    public deleteUser(socketId: string) {
        return this.users.delete(socketId)
    }

    handleConnection(@ConnectedSocket() socket: ICustomSocket, ...[args]: [IncomingMessage]) {
        // for tests
        socket.id = args.headers.authorization?.split(" ")[1] ?? args.headers.authorization

        //const token = args.headers.authorization?.split(" ")[1] ?? args.headers.authorization
        //socket.id = this.authService.verifyAccessToken(token).userId

        this.users.set(socket.id, socket)
    }

    handleDisconnect(@ConnectedSocket() socket: ICustomSocket) {
        this.users.delete(socket.id)
    }
}