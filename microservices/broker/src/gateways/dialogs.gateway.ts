import { ServerGateway } from './server.gateway';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { WEVENTS } from './enums/events.enum';
import { AddUserDialogDTO, ChangeFileDialogDTO, ChangeNameDialogDTO, CreateDialogDTO, Dialog, DialogHistory, DialogParticipants, DialogsServiceClient, GetUserDialogsDTO, ParticipantRights } from './../proto/dialogs';
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
     * @returns Передаёт созданный диалог (удалено: и уведомление об этом) всем участника диалога
     */
    @SubscribeMessage(WEVENTS.DIALOGS.CREATE)
    async createDialog(@MessageBody() data: CreateDialogDTO, @ConnectedSocket() {user_id}: ICustomSocket): Promise<void> {
        const dialog = await this.dialogsService.createDialog({
            participants: [{user_id, rights: ParticipantRights.CREATOR} as DialogParticipants, ...data.participants],
            name: data.name
        }).toPromise()

        // передаём всем участинкам диалога сам диалог и уведомление о его создании
        dialog.participants.forEach(async participant => {
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

        dialog.participants.forEach(async participant => 
            await this.serverGateway.broadcastUser<DialogHistory>(participant.user_id, {
                data: dialogHistoryNote,
                event: WEVENTS.DIALOGS.ADD_USER
            })
        )
    }

    @SubscribeMessage(WEVENTS.DIALOGS.CHANGE_NAME)
    async changeNameDialog(@MessageBody() data: Omit<ChangeNameDialogDTO, "user_id">, @ConnectedSocket() {user_id}: ICustomSocket): Promise<void> {
        const historyNote = await this.dialogsService.changeNameDialog({user_id, dialog_id: data.dialog_id, name: data.name}).toPromise()
        const dialog = await this.dialogsService.getDialog({id: data.dialog_id}).toPromise()

        dialog.participants.forEach(async participants => 
            await this.serverGateway.broadcastUser<DialogHistory>(participants.user_id, {
                data: historyNote,
                event: WEVENTS.DIALOGS.CHANGE_NAME
            })
        )
    }

    @SubscribeMessage(WEVENTS.DIALOGS.CHANGE_FILE)
    async changeFileDialog(@MessageBody() data: Omit<ChangeFileDialogDTO, "user_id">, @ConnectedSocket() {user_id}: ICustomSocket): Promise<void> {
        const historyNote = await this.dialogsService.changeFileDialog({user_id, dialog_id: data.dialog_id, file_id: data.file_id}).toPromise()
        const dialog = await this.dialogsService.getDialog({id: data.dialog_id}).toPromise()

        dialog.participants.forEach(async participants => 
            await this.serverGateway.broadcastUser<DialogHistory>(participants.user_id, {
                data: historyNote,
                event: WEVENTS.DIALOGS.CHANGE_FILE
            })
        )
    }
}