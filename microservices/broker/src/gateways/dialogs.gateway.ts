import { ServerGateway } from './server.gateway';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { WEVENTS } from './enums/events.enum';
import { AddUserDialogDTO, ChangeFileDialogDTO, ChangeNameDialogDTO, CreateDialogDTO, DeleteDialogDTO, DeleteUserDialogDTO, Dialog, DialogActionEnum, DialogHistory, DialogParticipants, DialogsServiceClient, GetUserDialogsDTO, ParticipantRights } from './../proto/dialogs';
import { DIALOGS_MODULE_CONFIG, USER_MODULE_CONFIG } from './../constants/app.constants';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { ICustomSocket } from './types/socket.type';
import { NotificationAdditionsEnumType, NotificationEnumType } from 'src/proto/notification';
import { forkJoin } from 'rxjs';
import { UserServiceClient } from 'src/proto/user';
import { BrokerResponse } from 'src/types';

@WebSocketGateway()
export class DialogsGateway {
    constructor(
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private usersService: UserServiceClient,
        private serverGateway: ServerGateway
    ) {}
    /**
     * Эта функция в body должна принимать id пользователей без передачи создателя (он добавляется автоматически)
     * @returns Передаёт созданный диалог (удалено: и уведомление об этом) всем участника диалога
     */
    @SubscribeMessage(WEVENTS.DIALOGS.CREATE)
    async createDialog(@MessageBody() data: CreateDialogDTO, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        this.dialogsService.createDialog({
            participants: [{user_id: client.user_id, rights: ParticipantRights.CREATOR} as DialogParticipants, ...data.participants],
            name: data.name
        }).subscribe({
            // передаём всем участинкам диалога сам диалог 
            next: dialog => 
                dialog.participants.forEach(async participant => 
                    await this.serverGateway.broadcastUser<Dialog>(participant.user_id, {
                        data: dialog,
                        event: WEVENTS.DIALOGS.CREATE
                    })
                ),
            error: e => this.serverGateway.sendError(client, e)
        })
    }

    /**
     * Эта функция добавляет пользователя в диалог
     * @returns Запись из истории диалога о добавлении пользователя
     */
    @SubscribeMessage(WEVENTS.DIALOGS.ADD_USER)
    async addUserToDialog(@MessageBody() {user_invited_id, dialog_id}: Omit<AddUserDialogDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        forkJoin({
            historyNote: this.dialogsService.addUserToDialog({user_id: client.user_id, user_invited_id, dialog_id}),
            dialog: this.dialogsService.getDialog({id: dialog_id})
        })
        .subscribe({
            next: ({historyNote, dialog}) => {
                const attachments = this.usersService.findUser({id: historyNote.item_id})

                attachments.subscribe(user => {
                    dialog.participants.forEach(async participant => 
                        await this.serverGateway.broadcastUser<BrokerResponse.DialogHistory>(participant.user_id, {
                            data: {...historyNote, attachments: {user}},
                            event: WEVENTS.DIALOGS.ADD_USER
                        })
                    )
                })
            },
            error: e => this.serverGateway.sendError(client, e)
        })
    }

    /**
     * Эта функция удаляет пользователя из диалога
     * @returns Запись из истории диалога о удалении пользователя
     */
    @SubscribeMessage(WEVENTS.DIALOGS.REMOVE_USER)
    async removeUserFromDialog(@MessageBody() {delete_id, dialog_id}: Omit<DeleteUserDialogDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        forkJoin({
            historyNote: this.dialogsService.removeUserDialog({user_id: client.user_id, delete_id, dialog_id}),
            dialog: this.dialogsService.getDialog({id: dialog_id})
        })
        .subscribe({
            next: async ({historyNote, dialog}) => {
                const attachments = this.usersService.findUser({id: historyNote.item_id})
                
                attachments.subscribe(user => {
                    dialog.participants.forEach(async participant => 
                        await this.serverGateway.broadcastUser<BrokerResponse.DialogHistory>(participant.user_id, {
                            data: {...historyNote, attachments: {user}},
                            event: WEVENTS.DIALOGS.REMOVE_USER
                        })
                    )
                })
                await this.serverGateway.sendNotification(
                    {to_id: delete_id, from_id: client.user_id, type: NotificationAdditionsEnumType.USER, item_id: delete_id, parent_type: NotificationAdditionsEnumType.DIALOG, parent_id: dialog_id, notification_type: NotificationEnumType.DELETE_USER_FROM_DIALOG},
                )   
            }
        })
    }

    /**
     * Эта функция изменяет название диалога
     * @returns Запись из истории диалога о изменении названия диалога
     */
    @SubscribeMessage(WEVENTS.DIALOGS.CHANGE_NAME)
    async changeNameDialog(@MessageBody() data: Omit<ChangeNameDialogDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        forkJoin({
            historyNote: this.dialogsService.changeNameDialog({user_id: client.user_id, dialog_id: data.dialog_id, name: data.name}),
            dialog: this.dialogsService.getDialog({id: data.dialog_id})
        })
        .subscribe({
            next: ({historyNote, dialog}) => dialog.participants.forEach(async participants => 
                await this.serverGateway.broadcastUser<DialogHistory>(participants.user_id, {
                    data: historyNote,
                    event: WEVENTS.DIALOGS.CHANGE_NAME
                })
            ),
            error: e => this.serverGateway.sendError(client, e)
        })
    }

    /**
     * Эта функция изменяет картинку (превьюшку хз) диалога
     * @returns Запись из истории диалога о изменении заставки
     */
    @SubscribeMessage(WEVENTS.DIALOGS.CHANGE_FILE)
    async changeFileDialog(@MessageBody() data: Omit<ChangeFileDialogDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        forkJoin({
            historyNote: this.dialogsService.changeFileDialog({user_id: client.user_id, dialog_id: data.dialog_id, file_id: data.file_id}),
            dialog: this.dialogsService.getDialog({id: data.dialog_id})
        })
        .subscribe({
            next: ({historyNote, dialog}) => dialog.participants.forEach(async participant => 
                await this.serverGateway.broadcastUser<DialogHistory>(participant.user_id, {
                    data: historyNote,
                    event: WEVENTS.DIALOGS.CHANGE_FILE
                })
            ),
            error: e => this.serverGateway.sendError(client, e)
        })
    }

    /**
     * Эта функция изменяет состояние диалога на неактивное (типо удалили)
     * @returns Каждому пользователю состоявшему в диалоге присылается уведомление о его удалении и запись в истории диалога
     */
    @SubscribeMessage(WEVENTS.DIALOGS.DELETE)
    async deleteDialog(@MessageBody() {dialog_id}: Omit<DeleteDialogDTO, "user_id">, @ConnectedSocket() client: ICustomSocket): Promise<void> {
        forkJoin({
            historyNote: this.dialogsService.deleteDialog({user_id: client.user_id, dialog_id}),
            dialog: this.dialogsService.getDialog({id: dialog_id})
        })
        .subscribe({
            next: ({historyNote, dialog}) =>  dialog.participants.forEach(async participant => {
                await this.serverGateway.broadcastUser<DialogHistory>(participant.user_id, {
                    data: historyNote,
                    event: WEVENTS.DIALOGS.DELETE
                })
                await this.serverGateway.sendNotification({
                    from_id: client.user_id,
                    to_id: participant.user_id,
                    type: NotificationAdditionsEnumType.USER,
                    item_id: client.user_id,
                    parent_id: dialog.id,
                    parent_type: NotificationAdditionsEnumType.DIALOG,
                    notification_type: NotificationEnumType.DELETE_DIALOG
                })
            }),
            error: e => this.serverGateway.sendError(client, e)
        })
    }
}