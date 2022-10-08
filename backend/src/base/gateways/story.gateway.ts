import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AddLikeStoryDTO, AddReferenceStoryDTO, AddStoryDTO, RemoveStoryDTO } from "../dto/stories";
import { Events } from "../enums";

@WebSocketGateway()
export class StoryGateway {
    constructor() {}

    @SubscribeMessage(Events.ADD_STORY)
    public async createStory(@MessageBody() body: AddStoryDTO) {}

    @SubscribeMessage(Events.ADD_LIKE_STORY)
    public async likeStory(@MessageBody() body: AddLikeStoryDTO) {}

    @SubscribeMessage(Events.ADD_REFERENCE_STORY)
    public async addReferenceStory(@MessageBody() body: AddReferenceStoryDTO) {}

    @SubscribeMessage(Events.REMOVE_STORY) 
    public async removeStory(@MessageBody() body: RemoveStoryDTO) {}
}