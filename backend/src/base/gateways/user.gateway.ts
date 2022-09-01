import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import type * as WebSocket from "ws"

@WebSocketGateway()
export class UserGateway {
    @SubscribeMessage("subscribeUser")
    async subscribeUser(@MessageBody() body, @ConnectedSocket() socket: WebSocket.WebSocket): Promise<WsResponse<any>> {
        //console.log(socket)

        return {
            event: "",
            data: ""
        }
    }
}