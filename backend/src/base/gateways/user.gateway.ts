import { UseFilters, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException, WsResponse } from "@nestjs/websockets";
import { WsAuthGuard } from "src/auth";
import { ICustomSocket } from "src/common";
import { WsExeptionFilter } from "../filters";
import { BaseGateway } from "./base.gateway";

@WebSocketGateway({})
@UseFilters(WsExeptionFilter)
@UseGuards(WsAuthGuard)
export class UserGateway {
    constructor(
        private baseGateway: BaseGateway
    ) {}

    @SubscribeMessage("subscribe.user")
    async subscribeUser(@MessageBody() body, @ConnectedSocket() socket: ICustomSocket): Promise<WsResponse<any>> {
        this.baseGateway.findUser(body.userId).send("Hello")
        return {
            event: "",
            data: ""
        }
    }
}