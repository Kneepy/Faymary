import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client, ClientGrpc } from "@nestjs/microservices";
import {COMMENTS_MODULE_CONFIG, getClientOptionsByConfig} from "../app.constants";
import {
    CommentsServiceClient,
    CreateCommentDTO,
    DeleteCommentDTO,
    GetCommentsDTO,
    IsDeleted,
    UpdateCommentDTO,
    Comment
} from "../proto/comments";

@Injectable()
export class CommentsClient implements OnModuleInit {
    @Client(getClientOptionsByConfig(COMMENTS_MODULE_CONFIG))
    client: ClientGrpc

    private commentsService: CommentsServiceClient;


    onModuleInit(): any {
        this.commentsService = this.client.getService<CommentsServiceClient>(COMMENTS_MODULE_CONFIG.SERVICE)
    }

    createComment(request: CreateCommentDTO): Promise<Comment> {
        return this.commentsService.createComment(request).toPromise()
    }

    deleteComment(request: DeleteCommentDTO): Promise<IsDeleted> {
        return this.commentsService.deleteComment(request).toPromise();
    }

    getComments(request: GetCommentsDTO): Promise<Comment> {
        return this.commentsService.getComments(request).toPromise();
    }

    updateComment(request: UpdateCommentDTO): Promise<Comment> {
        return this.commentsService.updateComment(request).toPromise();
    }
}