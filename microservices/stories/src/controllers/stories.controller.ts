import { StoryNotFound } from './../constants/errors.constants';
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
    FileNotFound,
    STORIES_SERVICE,
    STORIES_SERVICE_METHODS,
    UserDoesNotMatch
} from "src/constants";
import {
    CreateStoryDTO,
    DeleteStoryDTO,
    GetStoriesDTO,
    GetStoryDTO,
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

    @GrpcMethod(STORIES_SERVICE, STORIES_SERVICE_METHODS.GET_STORY)
    async getStory(data: GetStoryDTO): Promise<Story> {
        return await this.storiesService.findOne({id: data.id})
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
        const story = await this.storiesService.findOne({id: data.id})

        if(story) {
            if(story.user_id === data.user_id) return await this.storiesService.delete(data.id);
            else throw UserDoesNotMatch
        } else throw StoryNotFound
    }

    @GrpcMethod(STORIES_SERVICE, STORIES_SERVICE_METHODS.UPDATE_STORY)
    async updateStory(data: UpdateStoryDTO): Promise<Story> {
        const story = await this.storiesService.findOne({id: data.id})

        if(story.user_id === data.user_id) 
            return await this.storiesService.update(data);
        else throw UserDoesNotMatch
        
    }
}
