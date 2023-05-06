import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
    FailedDeleteMessage,
    Messages,
    MESSAGES_SERVICE_METHODS,
    MESSAGES_SERVICE_NAME,
    NotFoundDialog,
    NotFoundMessage
} from "src/common";
import {
    CreateMessageDTO,
    GetDialogMessagesDTO,
    GetMessageDTO,
    UpdateMessageDTO
} from "./dto";
import { MessagesService } from "./messages.service";

@Controller()
export class MessagesController {
    constructor(private messagesService: MessagesService) {}

    @GrpcMethod(MESSAGES_SERVICE_NAME, MESSAGES_SERVICE_METHODS.CREATE_MESSAGE)
    async createMessage(data: CreateMessageDTO): Promise<Messages> {
        if (!data.dialog_id) throw NotFoundDialog;
        
        return await this.messagesService.create(data);
    }

    @GrpcMethod(MESSAGES_SERVICE_NAME, MESSAGES_SERVICE_METHODS.GET_DIALOG_MESSAGES)
    async getDialogMessages(data: GetDialogMessagesDTO): Promise<{messages: Messages[]}> {
        if (!data.dialog_id) throw NotFoundDialog;

        return {messages: await this.messagesService.find(
            { dialog_id: data.dialog_id },
            { take: data.take, skip: data.skip }
        )}
    }

    @GrpcMethod(MESSAGES_SERVICE_NAME, MESSAGES_SERVICE_METHODS.GET_MESSAGE)
    async getMessage(data: GetMessageDTO): Promise<Messages> {
        return await this.messagesService.findOne({id: data.id})
    }

    @GrpcMethod(MESSAGES_SERVICE_NAME, MESSAGES_SERVICE_METHODS.UPDATE_MESSAGE)
    async updateDialogMessage(data: UpdateMessageDTO): Promise<Messages> {
        if (!data.id) throw NotFoundMessage;

        return await this.messagesService.update(data);
    }

    @GrpcMethod(MESSAGES_SERVICE_NAME, MESSAGES_SERVICE_METHODS.DELETE_MESSAGE)
    async deleteMessage(data: Pick<Messages, "id" | "user_id">): Promise<any> {
        const message = await this.messagesService.findOne({id: data.id})

        if(message.user_id !== data.user_id) throw FailedDeleteMessage

        await this.messagesService.delete(message.id);

        return message
    }
}
