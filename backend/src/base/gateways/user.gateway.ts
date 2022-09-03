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
import {
    NotificationEnumType,
    NotificationsService,
    UsersService
} from "src/mysql";
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
        private usersService: UsersService,
        private notificationService: NotificationsService
    ) {}

    @SubscribeMessage(Events.SUB_USER)
    async subscribeUser(
        @MessageBody() body: SubscribeUserDto,
        @ConnectedSocket() socket: ICustomSocket
    ): Promise<WsResponse<any>> {
        const author = await this.usersService.findOne({ id: body.userId }, { relations: ["subscribers", "notifications"] });
        const authorSocket = this.baseGateway.findUser(body.userId);
        const subscriber = await this.usersService.findOne({ id: socket.id });
        const subscriberIndex = author.subscribers.indexOf(subscriber);

        if (!!subscriberIndex) {
            author.subscribers.splice(subscriberIndex, 1);
        } else {
            author.subscribers.push(subscriber);

            if (
                !author.notifications.filter(
                    value =>
                        value.expirensIn > Date.now() &&
                        value.sender === subscriber &&
                        value.type === NotificationEnumType.SUB
                ).length
            ) {
                const notification = await this.notificationService.create({
                    user: author,
                    sender: subscriber,
                    type: NotificationEnumType.SUB
                });

                if (authorSocket) {
                    authorSocket.send({
                        event: Events.NEW_NOTIFICATION,
                        data: notification
                    });
                }
            }
        }

        if (authorSocket) {
            authorSocket.send({
                event: Events.REFRESH_USER,
                data: await this.usersService.update(author)
            });
        } else {
            await this.usersService.update(author);
        }

        return {
            event: Events.REFRESH_USER,
            data: "efwefwefwef"
        };
    }
}
