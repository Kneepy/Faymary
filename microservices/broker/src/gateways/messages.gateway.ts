import { Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { DIALOGS_MODULE_CONFIG, MESSAGES_MODULE_CONFIG, USER_MODULE_CONFIG } from "src/constants/app.constants";
import { DialogsServiceClient } from "src/proto/dialogs";
import {
    DeleteMessageDTO,
    Message,
    MessagesServiceClient,
} from "src/proto/messages";
import { WEVENTS } from "./enums/events.enum";
import { ServerGateway } from "./server.gateway";
import { ICustomSocket } from "./types/socket.type";
import { BrokerRequests, BrokerResponse } from "src/types";
import { UserServiceClient } from "src/proto/user";
import { AttachmentsProvider } from "../providers";
import { AttachmentType } from "../proto/attachments";

@WebSocketGateway()
export class MessagesGateway {
    constructor(
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesServiceClient,
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        private serverGateway: ServerGateway,
        private attachmentsProvider: AttachmentsProvider,
    ) {}

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.CREATE)
    async createMessage(@MessageBody() data: BrokerRequests.CreateMessage, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        try {
            const has_attachments = Object.entries(data.attachments).length > 0
            const [ message, { participants }, user ] = await Promise.all([
                this.messagesService.createMessage({user_id: client.user_id, has_attachments, ...data}).toPromise(),
                this.dialogsService.getAllParticipantsDialog({ dialog_id: data.dialog_id }).toPromise(),
                this.userService.findUser({id: client.user_id}).toPromise()
            ])
            const attachments = await this.attachmentsProvider.setAttachments({ parent_id: message.id, parent_type: AttachmentType.MESSAGE }, data.attachments);

            for (const participant of participants) {
                this.serverGateway.broadcastUser<BrokerResponse.Message>(participant.user_id, {
                    data: {
                        ...message,
                        attachments,
                        user
                    },
                    event: WEVENTS.DIALOGS.MESSAGES.CREATE
                });
            }
        } catch (e) {
            this.serverGateway.sendError(client, e);
        }
    }

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.UPDATE)
    async updateMessage(@MessageBody() data: BrokerRequests.UpdateMessage, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        try {
            const attachments = await this.attachmentsProvider.setAttachments({ parent_id: data.id, parent_type: AttachmentType.MESSAGE }, data.attachments);
            const has_attachments = Object.entries(data.attachments).length > 0
            const [ message, { participants }, user ] = await Promise.all([
                this.messagesService.updateMessage({user_id: client.user_id, has_attachments, ...data}).toPromise(),
                this.dialogsService.getAllParticipantsDialog({ dialog_id: data.dialog_id }).toPromise(),
                this.userService.findUser({id: client.user_id}).toPromise()
            ])

            for (const participant of participants) {
                this.serverGateway.broadcastUser<BrokerResponse.Message>(participant.user_id, {
                    data: {
                        ...message,
                        attachments,
                        user
                    },
                    event: WEVENTS.DIALOGS.MESSAGES.UPDATE
                })
            }
        } catch (e) {
            this.serverGateway.sendError(client, e)
        }
    }

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.DELETE)
    async deleteMessage(@MessageBody() {id}: Omit<DeleteMessageDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
       try {
           const deletedMessage = await this.messagesService.deleteMessage({user_id: client.user_id, id}).toPromise()
           const { participants } = await this.dialogsService.getAllParticipantsDialog({ dialog_id: deletedMessage.dialog_id }).toPromise()

           for (const participant of participants) {
               this.serverGateway.broadcastUser<Message>(participant.user_id, {
                   data: deletedMessage,
                   event: WEVENTS.DIALOGS.MESSAGES.DELETE
               })
           }
       } catch (e) {
           this.serverGateway.sendError(client, e)
       }
    }
}