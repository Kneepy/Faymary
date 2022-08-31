import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway()
export class UserGateway {
    @SubscribeMessage("test")
    test() {
        console.log("wfefefwef")
    }
}