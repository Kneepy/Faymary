import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { STORIES_MODULE_CONFIG } from "src/app.constants";
import { CreateStoryDTO, MarkType, StoriesServiceClient } from "src/proto/stories";
import { ICustomRequest } from "src/types/request.type";

@Controller()
export class StoriesController {
    constructor(
        @Inject(STORIES_MODULE_CONFIG) private storiesService: StoriesServiceClient
    ) {}

    @Post()
    async createStory(@Req() req: ICustomRequest, @Body() data: CreateStoryDTO) {
        if(data.marks.length) {
            data.marks.forEach(mark => {
                switch(mark.type){
                    case MarkType.post:
                        
                }
            })
        }
    }
}