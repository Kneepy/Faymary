import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException, WsResponse } from "@nestjs/websockets";
import { DIALOG_NOT_FOUND, FAILED_DELETE_USER_DIALOG, ICustomSocket, USER_NOT_FOUND_DIALOG, USER_NOT_FOUND_ID } from "src/common";
import { Dialogs, Messages, Users } from "src/entity";
import { DialogsService, MessagesService, NotificationEnumType, NotificationsService, UsersService } from "src/mysql";
import { AddUserToDialogDto, CreateDialgDto, CreateMessageDto, RemoveUserFromDialog, TransmitMessageToDialogDto } from "../dto/conversation";
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
        const dialog = await this.dialogsService.create({users: [...body.users, socket.user], creator: socket.user})

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

                await this.dialogsService.addUser(dialog, user, socket.user)

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

    @SubscribeMessage(Events.REMOVE_USER_DIALOG)
    public async removeUserFromDialog(@ConnectedSocket() socket: ICustomSocket, @MessageBody() body: RemoveUserFromDialog) {
        try {
            const dialog = await this.dialogsService.findOne({id: body.dialogId}, {relations: {relationships: {invited: true, inviter: true}, creator: true}})

            if(dialog) {
                const userRelationsips = dialog.relationships.find(relationship => relationship.invited.id === body.userId)

                if(userRelationsips) {
                    if(userRelationsips.inviter.id === socket.id) {
                        this.dialogsService.removeUser(dialog, userRelationsips.invited)
                        this.dialogsService.removeRelationship(userRelationsips.id)
                    } else {
                        if(socket.id === dialog.creator.id) {
                            this.dialogsService.removeUser(dialog, userRelationsips.invited)
                            this.dialogsService.removeRelationship(userRelationsips.id)
                        }
                        throw new ForbiddenException(FAILED_DELETE_USER_DIALOG)
                    }

                    const usersFromDialog = dialog.relationships.map(relationship => relationship.invited)
                    
                    usersFromDialog.forEach(async user => {
                        const userSocket = this.baseGateway.findUser(user.id)

                        if(userSocket) {
                            const notification = await this.baseGateway.setNotification({from: socket.user, to: user, type: NotificationEnumType.REMOVE_USER_DIALOG})

                            notification && await this.baseGateway.sendNotification(userSocket, notification, user)
                        }
                    })

                    return {
                        event: Events.REFRESH_DIALOG,
                        data: ""
                    }
                }
                else {
                    throw new NotFoundException(USER_NOT_FOUND_DIALOG)
                }
            } 
            else {
                throw new NotFoundException(DIALOG_NOT_FOUND)
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