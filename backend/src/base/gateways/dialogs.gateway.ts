import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException, WsResponse } from "@nestjs/websockets";
import { ICustomSocket } from "src/common";
import { Dialogs, Messages } from "src/entity";
import { DialogsService, MessagesService, NotificationEnumType, NotificationsService, UsersService } from "src/mysql";
import { AddUserToDialogDto, CreateDialgDto, CreateMessageDto, TransmitMessageToDialogDto } from "../dto/conversation";
import { Events } from "../enums";
import { BaseGateway } from "./base.gateway";

@WebSocketGateway()
export class DialogsGateway {
    constructor(
        private baseGateway: BaseGateway,
        private dialogsService: DialogsService,
        private messagesService: MessagesService,
        private usersService: UsersService,
        private notificationsService: NotificationsService
    ) {}

    @SubscribeMessage(Events.CREATE_DIALOG)
    public async createDialog(@ConnectedSocket() socket: ICustomSocket, @MessageBody() body: CreateDialgDto) {
        body.users.filter(user => user.id !== socket.user.id)
        const dialog = await this.dialogsService.create({users: [...(body.users), socket.user]})

        const userDialogSockets = this.baseGateway.findUsers(dialog.users.map(user => user.id))
        const notficationType = NotificationEnumType.ADD_DIALOG
        
        userDialogSockets.forEach(async userSocket => {
            const notification = await this.notificationsService.create({from: socket.user, to: userSocket.user, type: NotificationEnumType.ADD_DIALOG})
            await this.usersService.addNotification(notification)
            
            this.baseGateway.sendNotification(userSocket, notification, notficationType)
        })

        return {
            event: Events.REFRECH_DIALOG,
            data: dialog
        }
    }

    @SubscribeMessage(Events.ADD_MESSAGE_DIALOG)
    public async addMessageToDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: CreateMessageDto
    ): Promise<WsResponse<Messages>> {
        try {
            const dialog = await this.dialogsService.findOne({id: body.dialogId})
        
            if(dialog) {
                const message = await this.messagesService.create({
                    dialog, user: socket.user, message: body.message,
                    files: body.files
                })

                await this.dialogsService.addMessage(message)
    
                const userIds = dialog.users.map(user => user.id)
                const userSockets = this.baseGateway.findUsers(userIds)
                userSockets.forEach(userSocket => (userSocket.id !== socket.id) && userSocket.send(JSON.stringify(
                    {
                        event: Events.REFRESH_MESSAGES,
                        data: message
                    }
                )))

                return {
                    event: Events.REFRESH_MESSAGES,
                    data: message
                }
            }
        } catch (error) {
            throw new WsException(error)
        }
    }

    @SubscribeMessage(Events.ADD_USER_DIALOG)
    public async addUserToDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddUserToDialogDto
    ): Promise<WsResponse<Dialogs>> {return}

    @SubscribeMessage(Events.TRANSMIT_MESSAGE_DIALOG)
    public async transmitMessageToDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: TransmitMessageToDialogDto
    ) {return}
}