import { Controller, Delete, Get, Inject, Query, Req } from "@nestjs/common";
import { COMMENTS_MODULE_CONFIG } from "src/constants/app.constants";
import { DisableAuth } from "src/disable-auth.decorator";
import { Comments, CommentsServiceClient, DeleteCommentDTO, GetCommentDTO, GetCommentsDTO, IsDeleted, Comment } from "src/proto/comments";
import { ICustomRequest } from "src/types/request.type";

@Controller("comment")
export class CommentsController {
    constructor(
        @Inject(COMMENTS_MODULE_CONFIG.PROVIDER) private commentsService: CommentsServiceClient
    ) {}

    @Delete()
    async deleteComment(@Query() query: Omit<DeleteCommentDTO, "user_id">, @Req() req: ICustomRequest): Promise<IsDeleted> {
        return await this.commentsService.deleteComment({id: query.id, user_id: req.user_id}).toPromise()
    }

    @Get("many")
    @DisableAuth()
    async getComments(@Query() query: GetCommentsDTO): Promise<Comments> {
        return await this.commentsService.getComments(query).toPromise()
    }

    @Get()
    @DisableAuth()
    async getComment(@Query() query: GetCommentDTO): Promise<Comment> {
        return await this.commentsService.getComment(query).toPromise()
    }
}