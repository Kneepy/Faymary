import { ForbiddenException, NotFoundException } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WsException,
    WsResponse
} from "@nestjs/websockets";
import {
    DIALOG_NOT_FOUND,
    FAILED_DELETE_USER_DIALOG,
    ICustomSocket,
    USER_NOT_FOUND_DIALOG,
    USER_NOT_FOUND_ID
} from "src/common";
import { Dialogs, Messages, Users } from "src/entity";
import {
    DialogsService,
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
import { Events } from "../enums";
import { BaseGateway } from "./base.gateway";

@WebSocketGateway()
export class DialogsGateway {
    constructor(
        private baseGateway: BaseGateway,
        private dialogsService: DialogsService,
        private messagesService: MessagesService,
        private usersService: UsersService,
        private historyActionsService: HistoryActionsService
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
                type: notficationType
            });

            userSocket &&
                notification &&
                this.baseGateway.sendNotification(
                    userSocket,
                    notification,
                    dialog
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
        try {
            const dialog = await this.dialogsService.findOne(
                { id: body.dialogId },
                { relations: { users: true } }
            );

            if (dialog) {
                Object.keys(body).forEach(
                    key => !body[key] && delete body[key]
                );

                const message = await this.messagesService.create({
                    message: body.message,
                    files: body.files,
                    dialog,
                    user: socket.user,
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
        } catch (error) {
            throw new WsException(error);
        }
    }

    @SubscribeMessage(Events.ADD_USER_DIALOG)
    public async addUserToDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: AddUserToDialogDto
    ): Promise<WsResponse<{ dialog: Dialogs; user: Users }>> {
        try {
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
                            type: NotificationEnumType.ADD_USER_DIALOG
                        }
                    );

                    if (notification) {
                        const userSocket = this.baseGateway.findUser(user.id);
                        userSocket &&
                            (await this.baseGateway.sendNotification(
                                userSocket,
                                notification,
                                { dialog, user: accedingUser }
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
        } catch (e) {
            throw new WsException(e);
        }
    }

    @SubscribeMessage(Events.REMOVE_USER_DIALOG)
    public async removeUserFromDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: RemoveUserFromDialog
    ) {
        try {
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
                                    type: NotificationEnumType.REMOVE_USER_DIALOG
                                });

                            notification &&
                                (await this.baseGateway.sendNotification(
                                    userSocket,
                                    notification,
                                    { dialog, user }
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
        } catch (e) {
            throw new WsException(e);
        }
    }
}
