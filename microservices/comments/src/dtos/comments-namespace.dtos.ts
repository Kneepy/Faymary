import {Comments, CommentStateEnum, CommentTypeEnum} from "../common";

export namespace CommentDTOs {
    export class CreateCommentDTO implements Omit<Comments, "id" | "createdAt" | "state"> {
        file_ids: string;
        item_id: string;
        msg: string;
        type: CommentTypeEnum;
        user_id: string;
    }

    export class UpdateCommentDTO implements Omit<Comments, "createdAt"> {
        id: string;
        item_id: string;
        msg: string;
        state: CommentStateEnum;
        type: CommentTypeEnum;
        user_id: string;
        file_ids: string;
    }

    export class DeleteCommentDTO implements Pick<Comments, "id" | "user_id"> {
        id: string;
        user_id: string
    }

    export class GetCommentsDTO implements Pick<Comments, "type" | "item_id"> {
        item_id: string;
        type: CommentTypeEnum;
        take: number
        skip: number
    }

    export class GetCommentDTO implements Pick<Comments, "id"> {
        id: string;
    }
}