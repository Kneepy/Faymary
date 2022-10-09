import { ForbiddenException, NotFoundException, UseFilters, UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WsException,
    WsResponse
} from "@nestjs/websockets";
import { WsAuthGuard } from "src/auth";
import {
    DIALOG_NOT_FOUND,
    FAILED_DELETE_USER_DIALOG,
    FAILED_UPDATE_DILAOG,
    FILE_NOT_FOUND,
    ICustomSocket,
    USER_NOT_FOUND_DIALOG,
    USER_NOT_FOUND_ID
} from "src/common";
import { Dialogs, Messages, Users } from "src/entity";
import {
    DialogsService,
    FilesService,
    HistoryActionsService,
    MessagesService,
    NotificationEnumType,
    UsersService
} from "src/mysql";
import {
    AddUserToDialogDto,
    CreateDialgDto,
    CreateMessageDto,
    RemoveUserFromDialog
} from "../dto/conversation";
import { UpdateDialogDTO } from "../dto/conversation/update-dialog.dto";
import { Events } from "../enums";
import { WsExeptionFilter } from "../filters";
import { BaseGateway } from "./base.gateway";

@WebSocketGateway()
@UseFilters(WsExeptionFilter)
@UseGuards(WsAuthGuard)
export class DialogsGateway {
    constructor(
        private baseGateway: BaseGateway,
        private dialogsService: DialogsService,
        private messagesService: MessagesService,
        private usersService: UsersService,
        private historyActionsService: HistoryActionsService,
        private filesService: FilesService
    ) {}

    @SubscribeMessage(Events.CREATE_DIALOG)
    public async createDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: CreateDialgDto
    ): Promise<WsResponse<Dialogs>> {
        body.users = body.users.filter(user => user.id !== socket.user.id);

        const usersDialog = [...body.users, socket.user];
        const dialog = await this.dialogsService.create({
            users: usersDialog,
            creator: socket.user,
            title: `${usersDialog.map(user => user.userName)}`
        });
        const notficationType = NotificationEnumType.ADD_DIALOG;

        dialog.users.forEach(async user => {
            const userSocket = this.baseGateway.findUser(user.id);
            const notification = await this.baseGateway.setNotification({
                from: socket.user,
                to: user,
                type: notficationType,
                payload: {dialog}
            });

            userSocket &&
                notification &&
                this.baseGateway.sendNotification(
                    userSocket,
                    notification
                );
        });

        return {
            event: Events.REFRESH_DIALOG,
            data: dialog
        };
    }

    @SubscribeMessage(Events.ADD_MESSAGE_DIALOG)
    public async addMessageToDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: CreateMessageDto
    ): Promise<WsResponse<Messages>> {
        const dialog = await this.dialogsService.findOne(
            { id: body.dialogId },
            { relations: { users: true } }
        );

        if (dialog) {
            Object.keys(body).forEach(
                key => !body[key] && delete body[key]
            );

            const message = await this.messagesService.create({
                user: socket.user,
                dialog,
                ...body
            });

            await this.dialogsService.addMessage(message);
            delete message.user.settings;
            this.baseGateway
                .findUsers(dialog.users.map(user => user.id))
                .forEach(
                    userSocket =>
                        userSocket.id !== socket.id &&
                        userSocket.send(
                            JSON.stringify({
                                data: message,
                                event: Events.REFRESH_MESSAGES
                            })
                        )
                );

            return {
                data: message,
                event: Events.REFRESH_MESSAGES
            };
        } else {
            throw new NotFoundException(DIALOG_NOT_FOUND);
        }
    }

    @SubscribeMessage(Events.ADD_USER_DIALOG)
    public async addUserToDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddUserToDialogDto
    ): Promise<WsResponse<{ dialog: Dialogs; user: Users }>> {
        const accedingUser = await this.usersService.findOne({
            id: body.userId
        });

        if (accedingUser) {
            const dialog = await this.dialogsService.findOne(
                { id: body.dialogId },
                { relations: { users: true } }
            );

            await this.dialogsService.addUser(
                dialog,
                accedingUser,
                socket.user
            );

            dialog.users.forEach(async user => {
                // возможно нужно получать пользователя
                const notification = await this.baseGateway.setNotification(
                    {
                        to: user,
                        from: socket.user,
                        type: NotificationEnumType.ADD_USER_DIALOG,
                        payload: {user: accedingUser}
                    }
                );

                if (notification) {
                    const userSocket = this.baseGateway.findUser(user.id);
                    userSocket &&
                        (await this.baseGateway.sendNotification(
                            userSocket,
                            notification
                        ));
                }
            });

            return {
                event: Events.REFRESH_DIALOG,
                data: { dialog, user: accedingUser }
            };
        } else {
            throw new NotFoundException(USER_NOT_FOUND_ID);
        }
    }

    @SubscribeMessage(Events.REMOVE_USER_DIALOG)
    public async removeUserFromDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: RemoveUserFromDialog
    ) {
        const dialog = await this.dialogsService.findOne(
            { id: body.dialogId },
            { relations: { creator: true, users: true } }
        );

        if (dialog) {
            const userRelationsips =
                await this.historyActionsService.findOne(
                    {
                        dialog: { id: dialog.id },
                        subject: { id: body.userId }
                    },
                    { relations: { dialog: true, subject: true } }
                );

            if (userRelationsips) {
                if (userRelationsips.emmiter.id === socket.id) {
                    dialog.users = dialog.users.filter(
                        user => user.id !== body.userId
                    );
                    this.dialogsService.removeUser(
                        dialog,
                        userRelationsips.subject,
                        socket.user
                    );
                } else {
                    if (socket.id === dialog.creator.id) {
                        dialog.users = dialog.users.filter(
                            user => user.id !== body.userId
                        );
                        this.dialogsService.removeUser(
                            dialog,
                            userRelationsips.subject,
                            socket.user
                        );
                    } else {
                        throw new ForbiddenException(
                            FAILED_DELETE_USER_DIALOG
                        );
                    }
                }

                const usersFromDialog = dialog.users;

                usersFromDialog.forEach(async user => {
                    const userSocket = this.baseGateway.findUser(user.id);

                    if (userSocket) {
                        const notification =
                            await this.baseGateway.setNotification({
                                from: socket.user,
                                to: user,
                                type: NotificationEnumType.REMOVE_USER_DIALOG,
                                payload: {user: userRelationsips.subject}
                            });

                        notification &&
                            (await this.baseGateway.sendNotification(
                                userSocket,
                                notification
                            ));
                    }
                });

                return {
                    event: Events.REFRESH_DIALOG,
                    data: dialog
                };
            } else {
                throw new NotFoundException(USER_NOT_FOUND_DIALOG);
            }
        } else {
            throw new NotFoundException(DIALOG_NOT_FOUND);
        }
    }

    @SubscribeMessage(Events.UPDATE_DIALOG)
    public async updateDialog(@MessageBody() body: UpdateDialogDTO, @ConnectedSocket() socket: ICustomSocket) {
        const dialog = await this.dialogsService.findOne({id: body.dialogId}, {relations: {creator: true, users: true}})
        
        if(dialog) {
            if(body.creator) {
                if(socket.id === dialog.creator.id) {
                    dialog.creator = body.creator
                } else {
                    throw new ForbiddenException(FAILED_UPDATE_DILAOG)
                }
            }   
            if(body.frontFile) {
                const file = await this.filesService.findOne({id: body.frontFile.id})

                if(file) {
                    dialog.frontFile = file 
                } else {
                    throw new NotFoundException(FILE_NOT_FOUND)
                }
            }
            const updatedDialog = await this.dialogsService.update(dialog)

            dialog.users.forEach(user => {
                const userSocket = this.baseGateway.findUser(user.id)

                userSocket.send(JSON.stringify({
                    event: Events.REFRESH_DIALOG,
                    data: updatedDialog
                }))
            })
        }
    }
}
