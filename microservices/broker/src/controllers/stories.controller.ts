import { Body, Controller, Delete, Get, Inject, Patch, Post, Query, Req } from "@nestjs/common";
import { STORIES_MODULE_CONFIG, USER_MODULE_CONFIG } from "src/constants/app.constants";
import {
    CreateStoryDTO,
    DeleteStoryDTO,
    GetStoryDTO,
    StoriesServiceClient,
    Story,
    UpdateStoryDTO
} from "src/proto/stories";
import { ICustomRequest } from "src/types/request.type";
import { DisableAuth } from "src/disable-auth.decorator";
import { BrokerRequests, BrokerResponse } from "src/types";
import { UserServiceClient } from "src/proto/user";
import { AttachmentsProvider } from "../providers";
import { AttachmentType } from "../proto/attachments";

@Controller("story")
export class StoriesController {
    constructor(
        @Inject(STORIES_MODULE_CONFIG.PROVIDER) private storiesService: StoriesServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private usersService: UserServiceClient,
        private attachmentsProvider: AttachmentsProvider
    ) {}

    @Post()
    async createStory(@Req() req: ICustomRequest, @Body() data: Omit<CreateStoryDTO, "user_id">): Promise<Story> {
        /*
        if(data.marks.length) {
            for (const mark of data.marks) {

                if(!(await this.utilsService.getItem(<any>mark.type, mark.item_id).data.toPromise())) throw new NotFoundException()

            }
        }
         */

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

    /**
     * Возвращает скилет всех историй авторов на которых подписан пользователь
     */
    @Get("me-collection")
    async getStories(@Query() {take = 10, skip = 0}: BrokerRequests.GetMeCollectionStories, @Req() { user_id }: ICustomRequest): Promise<BrokerResponse.UserStories[]> {        
        const subscriptions = (await this.usersService.findSubscriptions({user_id, take, skip}).toPromise()).users

        return (subscriptions ?? []).reduce(async (stories: Promise<BrokerResponse.UserStories[]>, user) => {
            const userStories = await this.storiesService.getStories({user_id: user.id}).toPromise()

            if(userStories.stories?.length) {
                const acc = await stories
                acc.push({stories: userStories.stories, user})

                return acc
            }
        }, Promise.resolve([]))
    }

    @Get()
    @DisableAuth()
    async getStory(@Query() {id}: GetStoryDTO): Promise<BrokerResponse.Story> {
        const story = await this.storiesService.getStory({id}).toPromise()
        const attachments = await this.attachmentsProvider.getAttachments({ parent_id: story.id, parent_type: AttachmentType.STORY })

        return { ...story, attachments }
    }
}