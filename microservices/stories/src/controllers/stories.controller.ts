import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { FileNotFound, STORIES_SERVICE, STORIES_SERVICE_METHODS } from "src/constants";
import { CreateStoryDTO, GetStoriesDTO } from "src/dtos";
import { Story } from "src/entities";
import { StoriesService } from "src/providers";

@Controller()
export class StoriesController {
    constructor(
        private storiesService: StoriesService
    ) {}

    @GrpcMethod(STORIES_SERVICE, STORIES_SERVICE_METHODS.GET_STORIES)
    async getStories(data: GetStoriesDTO): Promise<Story[]> {
        const stories = await this.storiesService.find({user_id: data.user_id})

        return stories
    }

    @GrpcMethod(STORIES_SERVICE, STORIES_SERVICE_METHODS.CREATE_STORY)
    async createStory(data: CreateStoryDTO): Promise<Story> {
        if(!data.file_id) {
            throw FileNotFound
        }
        if(data.marks) {

        }
        
        return
    }
}