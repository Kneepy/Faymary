import { Controller, Delete, Get, Query, Req } from "@nestjs/common";
import { ICustomRequest } from "src/common";
import { Comments } from "src/entity";
import { CommentsService } from "src/mysql";
import { GetCommentsDto } from "../dto";

@Controller("/comments")
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Get("/")
    public async getComments(
        @Query() query: GetCommentsDto
    ): Promise<Comments[]> {
        const options = {
            relations: query.relations,
            take: query.take,
            skip: query.skip
        };
        const comments = await this.commentsService.find(
            { post: { id: query.postId } },
            options
        );

        return comments;
    }

    @Delete("/delete")
    public async deleteComment(
        @Req() req: ICustomRequest,
        @Query("id") id: string
    ) {
        const comment = await this.commentsService.findOne(
            { id },
            { relations: ["user"] }
        );

        if (comment.user.id === req.user.userId) {
            return await this.commentsService.remove(id);
        }
    }
}
