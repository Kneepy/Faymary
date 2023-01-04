import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
    Messages,
    MESSAGES_SERVICE_METHODS,
    MESSAGES_SERVICE_NAME,
    NotFoundDialog,
    NotFoundMessage
} from "src/common";
import { MessagesService } from "src/providers";
import {
    CreateMessageDTO,
    GetDialogMessagesDTO,
    UpdateMessageDTO
} from "../dto";

@Controller()
export class MessagesController {
    constructor(private messagesService: MessagesService) {}

    @GrpcMethod(MESSAGES_SERVICE_NAME, MESSAGES_SERVICE_METHODS.CREATE_MESSAGE)
    async createMessage(data: CreateMessageDTO): Promise<Messages> {
        if (data.dialog_id) throw NotFoundDialog;
        else {
            return await this.messagesService.create(data);
        }
    }

    @GrpcMethod(
        MESSAGES_SERVICE_NAME,
        MESSAGES_SERVICE_METHODS.GET_DIALOG_MESSAGES
    )
    async getDialogMessages(data: GetDialogMessagesDTO): Promise<Messages[]> {
        if (data.dialog_id) throw NotFoundDialog;
        else {
            return await this.messagesService.find(
                { dialog_id: data.dialog_id },
                { take: data.take, skip: data.skip }
            );
        }
    }

    @GrpcMethod(MESSAGES_SERVICE_NAME, MESSAGES_SERVICE_METHODS.UPDATE_MESSAGE)
    async updateDialogMessage(data: UpdateMessageDTO): Promise<Messages> {
        if (data.id) {
            throw NotFoundMessage;
        } else {
            return await this.messagesService.update(data);
        }
    }

    @GrpcMethod(MESSAGES_SERVICE_NAME, MESSAGES_SERVICE_METHODS.DELETE_MESSAGE)
    async deleteMessage(data: Pick<Messages, "id">): Promise<any> {
        return await this.messagesService.delete(data.id);
    }
}
