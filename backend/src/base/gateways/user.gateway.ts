import { UseFilters, UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WsResponse
} from "@nestjs/websockets";
import { WsAuthGuard } from "src/auth";
import { ICustomSocket } from "src/common";
import { NotificationEnumType, UsersService } from "src/mysql";
import { SubscribeUserDto } from "../dto";
import { Events } from "../enums";
import { WsExeptionFilter } from "../filters";
import { BaseGateway } from "./base.gateway";

@WebSocketGateway()
@UseFilters(WsExeptionFilter)
@UseGuards(WsAuthGuard)
export class UserGateway {
    constructor(
        private baseGateway: BaseGateway,
        private usersService: UsersService
    ) {}

    @SubscribeMessage(Events.SUB_USER)
    async subscribeUser(
        @MessageBody() body: SubscribeUserDto,
        @ConnectedSocket() socket: ICustomSocket
    ): Promise<WsResponse<any>> {
        const author = await this.usersService.findOne({id: body.userId}, {relations: {subscribers: true}})
        const subscriber = await this.usersService.findOne({id: socket.id}, {relations: {subscriptions: true}})
        const subscriberContainsIndex = author.subscribers.findIndex(user => user.id === subscriber.id)

        if(subscriberContainsIndex === -1) {
            await this.usersService.unsetSubscriber(subscriber, author)
        }
        else {
            await this.usersService.setSubscriber(subscriber, author)

            const notification = await this.baseGateway.setNotification({to: author, from: subscriber, type: NotificationEnumType.SUB})

            await this.baseGateway.sendNotification(this.baseGateway.findUser(author.id), notification, {...subscriber, subscriptions: undefined})
        }

        return {
            event: Events.REFRESH_USER,
            data: subscriber
        }
    }
}
