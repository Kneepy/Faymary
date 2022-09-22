import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { ICustomSocket } from "src/common";
import { Dialogs, Messages } from "src/entity";
import { DialogsService, MessagesService } from "src/mysql";
import { AddUserToDialogDto, CreateMessageDto, TransmitMessageToDialogDto } from "../dto/conversation";
import { Events } from "../enums";
import { BaseGateway } from "./base.gateway";

@WebSocketGateway()
export class DialogsGateway {
    constructor(
        private baseGateway: BaseGateway,
        private dialogsService: DialogsService,
        private messagesService: MessagesService
    ) {}

    @SubscribeMessage(Events.CREATE_DIALOG)
    public async test(@ConnectedSocket() socket: ICustomSocket, @MessageBody() body) {
        return {
            event: "test",
            data: await this.dialogsService.create({users: [socket.user]})
        }
    }

    @SubscribeMessage(Events.ADD_MESSAGE_DIALOG)
    public async addMessageToDialog(
        @ConnectedSocket() socket: ICustomSocket,
        @MessageBody() body: CreateMessageDto
    ): Promise<WsResponse<Messages>> {
        try {
            const dialog = await this.dialogsService.findOne({id: body.dialogId})

            return {
                event: "test",
                data: await this.messagesService.create({
                    dialog, user: socket.user, message: body.message,
                    files: body.files
                })
            }
        } catch (error) {
            console.log(error)
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