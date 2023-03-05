import { UserServiceClient } from './../proto/user';
import { PostServiceClient } from './../proto/post';
import { POST_MODULE_CONFIG, USER_MODULE_CONFIG } from './../app.constants';
import { Body, Controller, Delete, Get, Inject, NotFoundException, Patch, Post, Query, Req } from "@nestjs/common";
import { STORIES_MODULE_CONFIG } from "src/app.constants";
import { CreateStoryDTO, MarkType, StoriesServiceClient, Story, UpdateStoryDTO, GetStoriesDTO, Stories, DeleteStoryDTO } from "src/proto/stories";
import { ICustomRequest } from "src/types/request.type";
import { DisableAuth } from 'src/disable-auth.decorator';

@Controller()
export class StoriesController {
    constructor(
        @Inject(STORIES_MODULE_CONFIG) private storiesService: StoriesServiceClient,
        @Inject(POST_MODULE_CONFIG) private postService: PostServiceClient,
        @Inject(USER_MODULE_CONFIG) private userService: UserServiceClient,
    ) {}

    @Post()
    async createStory(@Req() req: ICustomRequest, @Body() data: Omit<CreateStoryDTO, "user_id">): Promise<Story> {
        if(data.marks.length) {
            data.marks.forEach(async mark => {
                switch(mark.type){
                    case MarkType.post:
                        if(!(await this.postService.getPost({id: mark.item_id}).toPromise())) throw NotFoundException
                        break
                    case MarkType.story: 
                        if(!(await this.storiesService.getStory({id: mark.item_id}).toPromise())) throw NotFoundException
                        break
                    case MarkType.user:
                        if(!(await this.userService.findUser({id: mark.item_id}).toPromise())) throw NotFoundException
                }
            })
        }
        return await this.storiesService.createStory({...data, user_id: req.user_id}).toPromise()
    }

    @Patch()
    async updateStory(@Req() req: ICustomRequest, @Body() data: Omit<UpdateStoryDTO, "user_id">): Promise<Story> {
        return await this.storiesService.updateStory({...data, user_id: req.user_id}).toPromise()
    }

    @Delete(":id/delete")
    async deleteStory(@Req() req: ICustomRequest, @Body() data: Omit<DeleteStoryDTO, "user_id">): Promise<any> {
        return !!(await this.storiesService.deleteStory({id: data.id, user_id: req.user_id}).toPromise())
    }

    @Get()
    @DisableAuth()
    async getStories(@Query() data: GetStoriesDTO): Promise<Stories> {
        return await this.storiesService.getStories(data).toPromise()
    }
}