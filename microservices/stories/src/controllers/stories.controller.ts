import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
    FileNotFound,
    STORIES_SERVICE,
    STORIES_SERVICE_METHODS
} from "src/constants";
import {
    CreateStoryDTO,
    DeleteStoryDTO,
    GetStoriesDTO,
    UpdateStoryDTO
} from "src/dtos";
import { Story } from "src/entities";
import { StoriesService } from "src/providers";

@Controller()
export class StoriesController {
    constructor(private storiesService: StoriesService) {}

    @GrpcMethod(STORIES_SERVICE, STORIES_SERVICE_METHODS.GET_STORIES)
    async getStories(data: GetStoriesDTO): Promise<Story[]> {
        const stories = await this.storiesService.find(
            {
                user_id: data.user_id
            },
            { relations: { marks: true } }
        );

        return stories;
    }

    @GrpcMethod(STORIES_SERVICE, STORIES_SERVICE_METHODS.CREATE_STORY)
    async createStory(data: CreateStoryDTO): Promise<Story> {
        if (!data.file_id) {
            throw FileNotFound;
        }

        return await this.storiesService.create(data as Story);
    }

    @GrpcMethod(STORIES_SERVICE, STORIES_SERVICE_METHODS.DELETE_STORY)
    async deleteStory(data: DeleteStoryDTO): Promise<any> {
        return await this.storiesService.delete(data.id);
    }

    @GrpcMethod(STORIES_SERVICE, STORIES_SERVICE_METHODS.UPDATE_STORY)
    async updateStory(data: UpdateStoryDTO): Promise<Story> {
        return await this.storiesService.update(data);
    }
}
