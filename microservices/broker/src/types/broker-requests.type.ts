import { GetStoriesDTO } from "src/proto/stories";

export namespace BrokerRequests {
    export interface GetMeCollectionStories extends GetStoriesDTO {
        take: number,
        skip: number
    }
}