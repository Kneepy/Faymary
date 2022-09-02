import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { ICustomSocket } from "../interfaces";

@WebSocketGateway()
export class UserGateway {
    @SubscribeMessage("subscribeUser")
    async subscribeUser(@MessageBody() body, @ConnectedSocket() socket: ICustomSocket): Promise<WsResponse<any>> {
        //console.log(socket)
        socket.emit()
        return {
            event: "",
            data: ""
        }
    }
}