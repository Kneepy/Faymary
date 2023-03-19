import { Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { LIKES_MODULE_CONFIG } from "src/constants/app.constants";
import { AddLikeDTO, LikesServiceClient } from "src/proto/likes";
import { NotificationAdditionsEnumType, NotificationEnumType } from "src/proto/notification";
import { WEVENTS } from "./enums/events.enum";
import { ServerGateway } from "./server.gateway";
import { ICustomSocket } from "./types/socket.type";

@WebSocketGateway()
export class LikesGateway {
    constructor(
        @Inject(LIKES_MODULE_CONFIG.PROVIDER) private likesService: LikesServiceClient,
        private serverGateway: ServerGateway
    ) {}

    @SubscribeMessage(WEVENTS.ADD_LIKE)
    async addLike(@MessageBody() {item_id, type}: Omit<AddLikeDTO, "user_id">, @ConnectedSocket() {user_id}: ICustomSocket): Promise<void> {
        const like = await this.likesService.addLike({type, item_id, user_id}).toPromise()
    
        await this.serverGateway.broadcastUser(user_id, {event: WEVENTS.ADD_LIKE, data: like})
        await this.serverGateway.sendNotification({
            from_id: user_id,
            notification_type: NotificationEnumType.ADD_LIKE,
            type: NotificationAdditionsEnumType.USER,
            item_id: user_id,
            parent_id: item_id,
            parent_type: type as any,
            to_id: null
        })
    }
}