import { Inject, UseFilters } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { forkJoin } from "rxjs";
import { DIALOGS_MODULE_CONFIG, MESSAGES_MODULE_CONFIG } from "src/constants/app.constants";
import { DialogsServiceClient } from "src/proto/dialogs";
import { CreateMessageDTO, DeleteMessageDTO, Message, MessagesSerivceClient, UpdateMessageDTO } from "src/proto/messages";
import { WEVENTS } from "./enums/events.enum";
import { WsExceptionFilter } from "./filters/ws-exception.filter";
import { ServerGateway } from "./server.gateway";
import { ICustomSocket } from "./types/socket.type";

@WebSocketGateway()
@UseFilters(WsExceptionFilter)
export class MessagesGateway {
    constructor(
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesSerivceClient,
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        private serverGateway: ServerGateway
    ) {}

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.CREATE)
    async createMessage(@MessageBody() data: Omit<CreateMessageDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        forkJoin([
            this.messagesService.createMessage({user_id: client.user_id, ...data}),
            this.dialogsService.getDialog({id: data.dialog_id})
        ]).subscribe({
            next: ([message, dialog]) => {
                dialog.participants.forEach(async participant => await this.serverGateway.broadcastUser<Message>(participant.user_id, {
                    data: message,
                    event: WEVENTS.DIALOGS.MESSAGES.CREATE
                }))
            },
            error: e => this.serverGateway.sendError(client, e)
        })
    }

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.UPDATE)
    async updateMessage(@MessageBody() data: Omit<UpdateMessageDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        forkJoin([
            this.messagesService.updateMessage({user_id: client.user_id, ...data}),
            this.dialogsService.getDialog({id: data.dialog_id})
        ]).subscribe({
            next: ([message, dialog]) => {
                dialog.participants.forEach(async participant => await this.serverGateway.broadcastUser<Message>(participant.user_id, {
                    data: message,
                    event: WEVENTS.DIALOGS.MESSAGES.UPDATE
                }))
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