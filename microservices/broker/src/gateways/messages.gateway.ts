import { Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import {forkJoin, merge, mergeAll, Subject} from "rxjs";
import { DIALOGS_MODULE_CONFIG, MESSAGES_MODULE_CONFIG, USER_MODULE_CONFIG } from "src/constants/app.constants";
import {DialogParticipants, DialogsServiceClient} from "src/proto/dialogs";
import {
    Attachment,
    CreateMessageDTO,
    DeleteMessageDTO,
    Message,
    MessagesServiceClient,
    UpdateMessageDTO
} from "src/proto/messages";
import { WEVENTS } from "./enums/events.enum";
import { ServerGateway } from "./server.gateway";
import { ICustomSocket } from "./types/socket.type";
import {Addition, BrokerResponse} from "src/types";
import { UtilsService } from "src/utils/get-item.util";
import { UserServiceClient } from "src/proto/user";

@WebSocketGateway()
export class MessagesGateway {
    constructor(
        @Inject(MESSAGES_MODULE_CONFIG.PROVIDER) private messagesService: MessagesServiceClient,
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        private utilsService: UtilsService,
        private serverGateway: ServerGateway
    ) {}

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.CREATE)
    async createMessage(@MessageBody() data: Omit<CreateMessageDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        /**
         * Собираем все вложения которые прикрепил юзер
         *
         * Конструкция один в один используется в updateMessage
         * Но я пока не буду выносить в отдельный метод
         */
        const attachments: Addition = {}

        if (!!data.attachments.length) {
            for (const attachment of data.attachments) {

                const { data, key } = this.utilsService.getItem(<any>attachment.type, attachment.id);

                data.subscribe(value => {
                    if (!value) return

                    attachments[key] = [...attachments[key], value]
                });

            }
        }

        forkJoin({
            message: this.messagesService.createMessage({user_id: client.user_id, ...data}),
            dialog: this.dialogsService.getDialog({id: data.dialog_id}),
            user: this.userService.findUser({id: client.user_id}),
        }).subscribe({
            next: ({message, dialog, user}) => {

                for (const participant of dialog.participants) {
                    this.serverGateway.broadcastUser<BrokerResponse.Message>(participant.user_id, {
                        data: {
                            ...message,
                            attachments,
                            user
                        },
                        event: WEVENTS.DIALOGS.MESSAGES.CREATE
                    });
                }

            },
            error: e => this.serverGateway.sendError(client, e)
        })
    }

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.UPDATE)
    async updateMessage(@MessageBody() data: Omit<UpdateMessageDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        /**
         * Собираем все вложения которые прикрепил юзер
         */
        const attachments: Addition = {}

        if (!!data.attachments.length) {
            for (const attachment of data.attachments) {

                const { data, key } = this.utilsService.getItem(<any>attachment.type, attachment.id);

                data.subscribe(value => {
                    if (!value) return

                    attachments[key] = [...attachments[key], value]
                });

            }
        }

        forkJoin({
            message: this.messagesService.updateMessage({user_id: client.user_id, ...data}),
            dialog: this.dialogsService.getDialog({id: data.dialog_id}),
            user: this.userService.findUser({id: client.user_id})
        }).subscribe({
            next: ({ message, dialog, user }) => {

                for (const participant of dialog.participants) {
                    this.serverGateway.broadcastUser<BrokerResponse.Message>(participant.user_id, {
                        data: {
                            ...message,
                            attachments,
                            user
                        },
                        event: WEVENTS.DIALOGS.MESSAGES.UPDATE
                    })
                }

            },
            error: e => this.serverGateway.sendError(client, e)
        })
    }

    @SubscribeMessage(WEVENTS.DIALOGS.MESSAGES.DELETE)
    async deleteMessage(@MessageBody() {id}: Omit<DeleteMessageDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        const deletedMessage = this.messagesService.deleteMessage({user_id: client.user_id, id})

        deletedMessage.subscribe({
            next: message => this.dialogsService.getDialog({id: message.dialog_id}).subscribe({
                next: dialog => dialog.participants.forEach(async participant => 
                    this.serverGateway.broadcastUser<Message>(participant.user_id, {
                        data: message,
                        event: WEVENTS.DIALOGS.MESSAGES.DELETE
                    })    
                )
            }),
            error: e => this.serverGateway.sendError(client, e)
        })
    }
}