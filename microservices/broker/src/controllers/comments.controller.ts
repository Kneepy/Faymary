import { Controller, Delete, Get, Inject, Query, Req } from "@nestjs/common";
import { COMMENTS_MODULE_CONFIG, USER_MODULE_CONFIG } from "src/constants/app.constants";
import { DisableAuth } from "src/disable-auth.decorator";
import { CommentsServiceClient, DeleteCommentDTO, GetCommentDTO, GetCommentsDTO, IsDeleted } from "src/proto/comments";
import { UserServiceClient } from "src/proto/user";
import { BrokerResponse } from "src/types";
import { ICustomRequest } from "src/types/request.type";
import { AttachmentsProvider } from "../providers";
import { AttachmentType } from "../proto/attachments";

@Controller("comment")
export class CommentsController {
    constructor(
        @Inject(COMMENTS_MODULE_CONFIG.PROVIDER) private commentsService: CommentsServiceClient,
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        private attachmentsProvider: AttachmentsProvider
    ) {}

    @Delete()
    async deleteComment(@Query() query: Omit<DeleteCommentDTO, "user_id">, @Req() req: ICustomRequest): Promise<IsDeleted> {
        return await this.commentsService.deleteComment({id: query.id, user_id: req.user_id}).toPromise()
    }

    @Get("many")
    @DisableAuth()
    async getComments(@Query() query: GetCommentsDTO): Promise<BrokerResponse.Comment[]> {
        const comments = (await this.commentsService.getComments(query).toPromise()).comments

        return Promise.all(comments.map(async comment => {
            const attachments = await this.attachmentsProvider.getAttachments({ parent_id: comment.id, parent_type: AttachmentType.COMMENT })
            const user = await this.userService.findUser({id: comment.user_id}).toPromise()

            return {...comment, attachments, user}
        }))
    }

    @Get()
    @DisableAuth()
    async getComment(@Query() query: GetCommentDTO): Promise<BrokerResponse.Comment> {
        const comment = await this.commentsService.getComment(query).toPromise()
        const attachments = await this.attachmentsProvider.getAttachments({ parent_id: comment.id, parent_type: AttachmentType.COMMENT })
        const user = await this.userService.findUser({id: comment.user_id}).toPromise()

        return {...comment, attachments, user}
    }
}