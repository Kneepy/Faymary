import { Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { USER_MODULE_CONFIG } from "src/constants/app.constants";
import { NotificationAdditionsEnumType, NotificationEnumType } from "src/proto/notification";
import { FollowUserDTO, UserFollowResult, UserServiceClient } from "src/proto/user";
import { WEVENTS } from "./enums/events.enum";
import { ServerGateway } from "./server.gateway";
import { ICustomSocket } from "./types/socket.type";

@WebSocketGateway()
export class UsersGateway {
    constructor(
        @Inject(USER_MODULE_CONFIG.PROVIDER) private usersService: UserServiceClient,
        private serverGateway: ServerGateway
    ) {}

    /**
     * Функция подписки на пользователя
     * Принимает author_id (id пользователя на которого подписываемся)
     * Возвращает клиенту статус подписки SUB | UNSUB и автора, а автору уведомление (только в случае SUB статуса)
     */
    @SubscribeMessage(WEVENTS.USER.SUBSCRIBE)
    async subscribeUser(@MessageBody() data: Omit<FollowUserDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        this.usersService.followUser({user_id: client.user_id, author_id: data.author_id}).subscribe({
            next: res => {
                this.serverGateway.broadcastUser<UserFollowResult>(client.user_id, {
                    data: res,
                    event: WEVENTS.USER.SUBSCRIBE
                })  
                if(res.isFollow) {
                    this.serverGateway.sendNotification({
                        to_id: data.author_id,
                        from_id: client.user_id,
                        notification_type: NotificationEnumType.SUB_USER,
                        type: NotificationAdditionsEnumType.USER,
                        item_id: client.user_id,
                        parent_type: NotificationAdditionsEnumType.USER,
                        parent_id: data.author_id
                    })
                }
            },
            error: e => this.serverGateway.sendError(client, e)
        })
    }
}