import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { WEVENTS } from './enums/events.enum';
import { CreateDialogDTO, DialogsServiceClient } from './../proto/dialogs';
import { DIALOGS_MODULE_CONFIG } from './../constants/app.constants';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { ICustomSocket } from './types/socket.type';


@WebSocketGateway()
export class DialogsGateway {
    constructor(
        @Inject(DIALOGS_MODULE_CONFIG.PROVIDER) private dialogsService: DialogsServiceClient
    ) {}

    @SubscribeMessage(WEVENTS.DIALOGS.CREATE)
    async createDialog(@MessageBody() data: Omit<CreateDialogDTO, "creator_id">, @ConnectedSocket() {user_id}: ICustomSocket): Promise<void> {
        
    }
}