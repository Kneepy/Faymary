import {Comments} from "../common";

export namespace CommentType {
    export interface CreateCommentInterface extends Omit<Comments, "id" | "createdAt"> {}

    export interface UpdateCommentInterface extends Omit<Comments, "createdAt"> {}

    export interface FindOneCommentInterface extends Pick<Comments, "id"> {}

    export interface FindManyCommentsInterface extends Omit<Comments, "id"> {}
}