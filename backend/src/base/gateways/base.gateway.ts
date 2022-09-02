import { UseFilters } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { IncomingMessage } from "http";
import { AuthService } from "src/auth";
import { WsExeptionFilter } from "../filters";
import { ICustomSocket } from "../interfaces";
import { WsUsersStore } from "./ws-users.store";

@WebSocketGateway({cors: {origin: "*"}})
@UseFilters(new WsExeptionFilter())
export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private authService: AuthService
    ) {}

    private usersStore: WsUsersStore = new WsUsersStore()

    async handleConnection(@ConnectedSocket() socket: ICustomSocket, ...[args]: [IncomingMessage]) {
        // for tests
        // socket.id = args.headers.authorization?.split(" ")[1] ?? args.headers.authorization

        const token = args.headers.authorization?.split(" ")[1] ?? args.headers.authorization
        socket.id = this.authService.verifyAccessToken(token).userId

        this.usersStore.set(socket.id, socket)
    }

    handleDisconnect(@ConnectedSocket() socket: ICustomSocket) {
        this.usersStore.delete(socket.id)
    }
}