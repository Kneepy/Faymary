import { GetStoriesDTO } from "src/proto/stories";
import { CreateMessageDTO, UpdateMessageDTO } from "../proto/messages";
import { Addition } from "./additions.type";
import { CreateCollectionDTO } from "../proto/likes";

export namespace BrokerRequests {
    export interface GetMeCollectionStories extends GetStoriesDTO {
        take: number,
        skip: number
    }

    export namespace Message {
        export interface Create extends Omit<CreateMessageDTO, "user_id"> {
            attachments: Addition
        }

        export interface Update extends Omit<UpdateMessageDTO, "user_id"> {
            attachments: Addition
        }

        export interface AddReaction extends CreateCollectionDTO {
            message_id: string
        }
    }

}