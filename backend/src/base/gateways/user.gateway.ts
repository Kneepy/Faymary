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
        const author = await this.usersService.findOne(
            { id: body.userId },
            {
                relations: [
                    "subscribers",
                    "settings",
                    "notifications",
                    "notifications.sender"
                ]
            }
        );
        const authorSocket = this.baseGateway.findUser(body.userId);
        const subscriber = await this.usersService.findOne({ id: socket.id });
        const subscriberIndex = author.subscribers.indexOf(
            author.subscribers.find(e => e.id === subscriber.id)
        );

        if (subscriberIndex !== -1) {
            author.subscribers.splice(subscriberIndex, 1);
        } else {
            author.subscribers.push(subscriber);

            if (
                author.settings.subscriptionNotifications &&
                !author.notifications.filter(
                    value =>
                        value.expirensIn < Date.now() &&
                        value.sender.id === subscriber.id
                ).length
            ) {
                const notification = await this.notificationService.create({
                    user: author,
                    sender: subscriber,
                    type: NotificationEnumType.SUB
                });
                author.notifications.push(notification);
            }
        }

        const updatedAuthor = await this.usersService.update(author)

        if (authorSocket) {
            authorSocket.send(
                JSON.stringify({
                    event: Events.REFRESH_USER,
                    data: updatedAuthor
                })
            );
        }

        return {
            event: Events.REFRESH_USER,
            data: await this.usersService.findOne(
                { id: socket.id },
                { relations: ["subscriptions"] }
            ) // возможно это нужно заменить
        };
    }
}
