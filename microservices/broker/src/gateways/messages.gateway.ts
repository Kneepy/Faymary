import { Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { forkJoin } from "rxjs";
import { DIALOGS_MODULE_CONFIG, MESSAGES_MODULE_CONFIG, USER_MODULE_CONFIG } from "src/constants/app.constants";
import { DialogsServiceClient } from "src/proto/dialogs";
import { CreateMessageDTO, DeleteMessageDTO, Message, MessagesSerivceClient, UpdateMessageDTO } from "src/proto/messages";
import { WEVENTS } from "./enums/events.enum";
import { ServerGateway } from "./server.gateway";
import { ICustomSocket } from "./types/socket.type";
import { BrokerResponse } from "src/types";
import { UtilsService } from "src/utils/get-item.util";
import { UserServiceClient } from "src/proto/user";

@WebSocketGateway()
export class MessagesGateway {
    constructor(
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesSerivceClient,
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        private utilsService: UtilsService,
        private serverGateway: ServerGateway
    ) {}

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.CREATE)
    async createMessage(@MessageBody() data: Omit<CreateMessageDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        forkJoin({
            message: this.messagesService.createMessage({user_id: client.user_id, ...data}),
            dialog: this.dialogsService.getDialog({id: data.dialog_id})
        }).subscribe({
            next: ({message, dialog}) => {
                const attachments = this.utilsService.getItem(message.attachment, message.item_id)

                forkJoin({
                    attachment: attachments.data,
                    user: this.userService.findUser({id: message.user_id})
                }).subscribe(async ({attachment, user}) => {
                    dialog.participants.forEach(async participant => await this.serverGateway.broadcastUser<BrokerResponse.Message>(participant.user_id, {
                        data: {...message, attachments: {[attachments.key]: attachment}, user},
                        event: WEVENTS.DIALOGS.MESSAGES.CREATE
                    }))
                })
            },
            error: e => this.serverGateway.sendError(client, e)
        })
    }

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.UPDATE)
    async updateMessage(@MessageBody() data: Omit<UpdateMessageDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        forkJoin({
            message: this.messagesService.updateMessage({user_id: client.user_id, ...data}),
            dialog: this.dialogsService.getDialog({id: data.dialog_id})
        }).subscribe({
            next: ({message, dialog}) => {
                const attachments = this.utilsService.getItem(message.attachment, message.item_id)

                forkJoin({
                    attachment: attachments.data,
                    user: this.userService.findUser({id: message.user_id})
                }).subscribe(async ({attachment, user}) => {
                    dialog.participants.forEach(async participant => await this.serverGateway.broadcastUser<BrokerResponse.Message>(participant.user_id, {
                        data: {...message, attachments: {[attachments.key]: attachment}, user},
                        event: WEVENTS.DIALOGS.MESSAGES.UPDATE
                    }))
                })
            },
            error: e => this.serverGateway.sendError(client, e)
        })
    }

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.DELETE)
    async deleteMessage(@MessageBody() {id}: Omit<DeleteMessageDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
   
        this.messagesService.deleteMessage({user_id: client.user_id, id}).subscribe({
            next: message => this.dialogsService.getDialog({id: message.dialog_id}).subscribe({
                next: dialog => dialog.participants.forEach(async participant => 
                    await this.serverGateway.broadcastUser<Message>(participant.user_id, {
                        data: message,
                        event: WEVENTS.DIALOGS.MESSAGES.DELETE
                    })    
                )
            }),
            error: e => this.serverGateway.sendError(client, e)
        })
    }
}