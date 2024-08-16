import { Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import {
    DIALOGS_MODULE_CONFIG,
    LIKES_MODULE_CONFIG,
    MESSAGES_MODULE_CONFIG,
    USER_MODULE_CONFIG
} from "src/constants/app.constants";
import { DialogsServiceClient } from "src/proto/dialogs";
import { DeleteMessageDTO, Message, MessagesServiceClient } from "src/proto/messages";
import { WEVENTS } from "./enums/events.enum";
import { ServerGateway } from "./server.gateway";
import { ICustomSocket } from "./types/socket.type";
import { BrokerRequests, BrokerResponse, Fields } from "src/types";
import { UserServiceClient } from "src/proto/user";
import { AttachmentsProvider } from "../providers";
import { AttachmentType } from "../proto/attachments";
import { LikesServiceClient } from "../proto/likes";
import { NotFoundMessage } from "../constants/errors.constants";

@WebSocketGateway()
export class MessagesGateway {
    constructor(
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesServiceClient,
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        @Inject(LIKES_MODULE_CONFIG.PROVIDER) private likesService: LikesServiceClient,
        private serverGateway: ServerGateway,
        private attachmentsProvider: AttachmentsProvider,
    ) {}

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.CREATE)
    async createMessage(@MessageBody() data: BrokerRequests.Message.Create, @ConnectedSocket() client: ICustomSocket): Promise<void> {
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
    async updateMessage(@MessageBody() data: BrokerRequests.Message.Update, @ConnectedSocket() client: ICustomSocket): Promise<void> {
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
    async deleteMessage(@MessageBody() { id }: Omit<DeleteMessageDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
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

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.ADD_REACTION)
    async addReactionMessage(@MessageBody() { unity, message_id }: BrokerRequests.Message.AddReaction, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        const message = await this.messagesService.getMessage({ id: message_id }).toPromise()

        if (!message) {
            this.serverGateway.sendError(client, NotFoundMessage)
            return
        }

        const { likes } = await this.attachmentsProvider.getAttachmentsByType({
            parent_id: message.id,
            parent_type: AttachmentType.MESSAGE,
            attached_type: AttachmentType.LIKE
        })
        const collection = likes.find(v => v.unity === unity)

        if (!collection) {

            const newCollection = await this.likesService.createCollection({ unity }).toPromise()
            await this.likesService.addLike({ user_id: client.user_id, collection_id: newCollection.id }).toPromise()
            await this.attachmentsProvider.addAttachment({
                parent_type: AttachmentType.MESSAGE,
                parent_id: message.id,
                attached_id: newCollection.id,
                attached_type: AttachmentType.LIKE
            })

        } else {

            await this.likesService.addLike({ user_id: client.user_id, collection_id: collection.id }).toPromise()

        }

        const { participants } = await this.dialogsService.getAllParticipantsDialog({
            dialog_id: message.dialog_id
        }).toPromise()

        for (const participant of participants) {
            this.serverGateway.broadcastUser<BrokerResponse.AddLikeResult>(participant.user_id, {
                data: {
                    message_id,
                    likes: (await this.attachmentsProvider.getAttachmentsByType({ parent_id: message_id, parent_type: AttachmentType.MESSAGE, attached_type: AttachmentType.LIKE })).likes
                },
                event: WEVENTS.DIALOGS.MESSAGES.ADD_REACTION
            })
        }
    }
}