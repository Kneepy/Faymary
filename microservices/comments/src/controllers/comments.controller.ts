import {CommentsService} from "../providers";
import {Controller} from "@nestjs/common";
import {GrpcMethod} from "@nestjs/microservices";
import {Comments, COMMENTS_SERVICE_METHODS, COMMENTS_SERVICE_NAME, CommentStateEnum, NotFoundComment} from "../common";
import {CommentDTOs} from "../dtos";

@Controller()
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @GrpcMethod(COMMENTS_SERVICE_NAME, COMMENTS_SERVICE_METHODS.CREATE_COMMENT)
    async createComment(data: CommentDTOs.CreateCommentDTO): Promise<Comments> {
        if(Array.isArray(data.file_ids)) data.file_ids = data.file_ids.join(",")

        return await this.commentsService.create(data)
    }

    @GrpcMethod(COMMENTS_SERVICE_NAME, COMMENTS_SERVICE_METHODS.UPDATE_COMMENT)
    async updateComment(data: CommentDTOs.UpdateCommentDTO): Promise<Comments> {
        if(Array.isArray(data.file_ids)) data.file_ids = data.file_ids.join(",")

        const comment = await this.commentsService.findOne({id: data.id})

        if(data.id && comment && comment.user_id === data.user_id) {
            return await this.commentsService.update(Object.assign(comment, data))
        } else throw NotFoundComment
    }

    @GrpcMethod(COMMENTS_SERVICE_NAME, COMMENTS_SERVICE_METHODS.DELETE_COMMENT)
    async deleteComment(data: CommentDTOs.DeleteCommentDTO): Promise<{isDeleted: boolean}> {
        const comment = await this.commentsService.findOne({id: data.id})

        if(data.id && comment && data.user_id === comment.user_id) {
            comment.state = CommentStateEnum.UNACTIVE
            await this.commentsService.update(comment)

            return {isDeleted: true}
        } else throw NotFoundComment
    }

    @GrpcMethod(COMMENTS_SERVICE_NAME, COMMENTS_SERVICE_METHODS.GET_COMMENTS_ITEM)
    async getCommentsByTypeAndItem({skip, take, item_id, type}: CommentDTOs.GetCommentsDTO): Promise<{comments: Comments[]}> {
        const comments = await this.commentsService.find({type, item_id}, {skip, take})
        comments.forEach(comment => comment.file_ids = comment.file_ids?.split(",") as any)

        return {comments: comments}
    }

    @GrpcMethod(COMMENTS_SERVICE_NAME, COMMENTS_SERVICE_METHODS.GET_COMMENT)
    async getComment({id}: CommentDTOs.GetCommentDTO): Promise<Comments> {
        const comment = await this.commentsService.findOne({id})

        if(id && comment) {
            return comment
        } else throw NotFoundComment
    }
}