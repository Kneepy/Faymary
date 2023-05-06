import {Comments} from "../common";

export namespace CommentType {
    export interface CreateCommentInterface extends Omit<Comments, "id" | "createdAt" | "state"> {}

    export interface UpdateCommentInterface extends Omit<Comments, "createdAt"> {}

    export interface FindOneCommentInterface extends Pick<Comments, "id"> {}

    export interface FindManyCommentsInterface extends Partial<Omit<Comments, "id">> {}
}