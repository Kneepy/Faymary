import { NotFoundException } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException, WsResponse } from "@nestjs/websockets";
import { DIALOG_NOT_FOUND, ICustomSocket, USER_NOT_FOUND_ID } from "src/common";
import { Dialogs, Messages, Users } from "src/entity";
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
        private usersService: UsersService
    ) {}

    @SubscribeMessage(Events.CREATE_DIALOG)
    public async createDialog(@ConnectedSocket() socket: ICustomSocket, @MessageBody() body: CreateDialgDto): Promise<WsResponse<Dialogs>> {
        body.users.filter(user => user.id !== socket.user.id)
        const dialog = await this.dialogsService.create({users: [...(body.users), socket.user]})

        const userDialogSockets = this.baseGateway.findUsers(dialog.users.map(user => user.id))
        const notficationType = NotificationEnumType.ADD_DIALOG
        
        userDialogSockets.forEach(async userSocket => {
            const notification = await this.baseGateway.setNotification({from: socket.user, to: userSocket.user, type: notficationType})
            await this.usersService.addNotification(notification)
            
            this.baseGateway.sendNotification(userSocket, notification, dialog)
        })

        return {
            event: Events.REFRESH_DIALOG,
            data: dialog
        }
    }

    @SubscribeMessage(Events.ADD_MESSAGE_DIALOG)
    public async addMessageToDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: CreateMessageDto
    ): Promise<WsResponse<Messages>> {
        try {
            const dialog = await this.dialogsService.findOne({id: body.dialogId}, {relations: {users: true}})
            
            if(dialog) {
                const message = await this.messagesService.create({message: body.message, files: body.files, dialog, user: socket.user})

                await this.dialogsService.addMessage(message)
                
                delete message.user.settings
                delete message.user.activity

                this.baseGateway.findUsers(dialog.users.map(user => user.id)).forEach(userSocket => userSocket.id !== socket.id && userSocket.send(JSON.stringify({
                    data: message,
                    event: Events.REFRESH_MESSAGES
                }))) 

                return {
                    data: message, 
                    event: Events.REFRESH_MESSAGES
                }
            }
            else {
                throw new NotFoundException(DIALOG_NOT_FOUND)
            }
        } catch (error) {
            throw new WsException(error)
        }
    }

    @SubscribeMessage(Events.ADD_USER_DIALOG)
    public async addUserToDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddUserToDialogDto
    ): Promise<WsResponse<{dialog: Dialogs, user: Users}>> {
        try {
            const user = await this.usersService.findOne({id: body.userId})
        
            if(user) {
                const dialog = await this.dialogsService.findOne({id: body.dialogId}, {relations: {users: true}})

                await this.dialogsService.addUser(dialog, user)

                dialog.users.map(user => user.id).forEach(async id => {
                    // возможно нужно получать пользователя
                    const notification = await this.baseGateway.setNotification({to: {id} as Users, from: socket.user, type: NotificationEnumType.ADD_USER_DIALOG})

                    await this.usersService.addNotification(notification)
                    await this.baseGateway.sendNotification(this.baseGateway.findUser(id), notification, {dialog, user})
                })

                return {
                    event: Events.REFRESH_DIALOG,
                    data: {dialog, user}
                }
            }
            else {
                throw new NotFoundException(USER_NOT_FOUND_ID)
            }
        } catch (e) {
            throw new WsException(e)
        }
    }

    @SubscribeMessage(Events.TRANSMIT_MESSAGE_DIALOG)
    public async transmitMessageToDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: TransmitMessageToDialogDto
    ) {return}
}