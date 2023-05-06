import { Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { LIKES_MODULE_CONFIG } from "src/constants/app.constants";
import { AddLikeDTO, LikesServiceClient } from "src/proto/likes";
import { NotificationAdditionsEnumType, NotificationEnumType } from "src/proto/notification";
import { WEVENTS } from "./enums/events.enum";
import { ServerGateway } from "./server.gateway";
import { ICustomSocket } from "./types/socket.type";
import { BrokerResponse } from "src/types";
import { UtilsService } from "src/utils/get-item.util";

@WebSocketGateway()
export class LikesGateway {
    constructor(
        @Inject(LIKES_MODULE_CONFIG.PROVIDER) private likesService: LikesServiceClient,
        private utilsService: UtilsService,
        private serverGateway: ServerGateway
    ) {}

    @SubscribeMessage(WEVENTS.ADD_LIKE)
    async addLike(@MessageBody() {item_id, type}: Omit<AddLikeDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        this.likesService.addLike({type, item_id, user_id: client.user_id}).subscribe({
            next: async (like: BrokerResponse.Like) => {
                const attachment = this.utilsService.getItem(type, item_id)
                
                attachment.data.subscribe(async attach => {
                    like.attachments = {[attachment.key]: attach}
                    await this.serverGateway.broadcastUser<BrokerResponse.Like>(client.user_id, {event: WEVENTS.ADD_LIKE, data: like})
                })
                await this.serverGateway.sendNotification({
                    from_id: client.user_id,
                    notification_type: NotificationEnumType.ADD_LIKE,
                    type: NotificationAdditionsEnumType.USER,
                    item_id: client.user_id,
                    parent_id: item_id,
                    parent_type: type as any,
                    to_id: null
                })
            },
            error: e => this.serverGateway.sendError(client, e)
        })
    }
}