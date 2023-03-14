import { ServerGateway } from './server.gateway';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { WEVENTS } from './enums/events.enum';
import { AddUserDialogDTO, CreateDialogDTO, Dialog, DialogHistory, DialogParticipants, DialogsServiceClient, ParticipantRights } from './../proto/dialogs';
import { DIALOGS_MODULE_CONFIG } from './../constants/app.constants';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { ICustomSocket } from './types/socket.type';
import { NotificationEnumType } from 'src/proto/notification';


@WebSocketGateway()
export class DialogsGateway {
    constructor(
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient,
        private serverGateway: ServerGateway
    ) {}

    /**
     * Эта функция в body должна принимать id пользователей без передачи создателя (он добавляется автоматически)
     * @returns Передаёт созданный диалог и уведомление об этом всем участника диалога
     */
    @SubscribeMessage(WEVENTS.DIALOGS.CREATE)
    async createDialog(@MessageBody() data: CreateDialogDTO, @ConnectedSocket() {user_id}: ICustomSocket): Promise<void> {
        const dialog = await this.dialogsService.createDialog({
            participants: [{user_id, rights: ParticipantRights.CREATOR} as DialogParticipants, ...data.participants],
            name: data.name
        }).toPromise()

        // передаём всем участинкам диалога сам диалог и уведомление о его создании
        dialog.participants.forEach(async participant => {
            await this.serverGateway.sendNotification({
                from_id: user_id,
                to_id: participant.user_id, 
                type: NotificationEnumType.USER,
                item_id: participant.user_id,
                parent_type: NotificationEnumType.DIALOG,
                parent_id: dialog.id,
            }, WEVENTS.NOTIFICATIONS_TYPE.DIALOG.ADD_USER)
            await this.serverGateway.broadcastUser<Dialog>(participant.user_id, {
                data: dialog,
                event: WEVENTS.DIALOGS.CREATE
            })
        })
    }

    /**
     * Эта функция добавляет пользователя в диалог
     * @returns Запись из истории диалога о добавлении пользователя
     */
    @SubscribeMessage(WEVENTS.DIALOGS.ADD_USER)
    async addUserToDialog(@MessageBody() {user_invited_id, dialog_id}: Omit<AddUserDialogDTO, "user_id">, @ConnectedSocket() {user_id}: ICustomSocket): Promise<void> {
        const dialogHistoryNote = await this.dialogsService.addUserToDialog({user_id, user_invited_id, dialog_id}).toPromise()
        const dialog = await this.dialogsService.getDialog({id: dialog_id}).toPromise()

        dialog.participants.forEach(async participant => {
            await this.serverGateway.sendNotification({
                from_id: user_id,
                to_id: participant.user_id,
                type: NotificationEnumType.USER,
                item_id: user_invited_id,
                parent_type: NotificationEnumType.DIALOG,
                parent_id: dialog.id
            }, WEVENTS.NOTIFICATIONS_TYPE.DIALOG.ADD_USER)
            await this.serverGateway.broadcastUser<DialogHistory>(participant.user_id, {
                data: dialogHistoryNote,
                event: WEVENTS.DIALOGS.ADD_USER
            })
        })
    }
}