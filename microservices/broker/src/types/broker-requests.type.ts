import { GetStoriesDTO } from "src/proto/stories";
import { CreateMessageDTO, UpdateMessageDTO } from "../proto/messages";
import { Addition } from "./additions.type";

export namespace BrokerRequests {
    export interface GetMeCollectionStories extends GetStoriesDTO {
        take: number,
        skip: number
    }

    export interface CreateMessage extends Omit<CreateMessageDTO, "user_id"> {
        attachments: Addition
    }

    export interface UpdateMessage extends Omit<UpdateMessageDTO, "user_id"> {
        attachments: Addition
    }
}