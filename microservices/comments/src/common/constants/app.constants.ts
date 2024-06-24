import * as path from "path";
import {CommentStateEnum} from "../enums";

export const MODULE_PACKAGE_NAME = "comments";
export const MODULE_PORT = 5010
export const MODULE_HOST = `localhost:${MODULE_PORT}`
export const COMMENTS_PROTO_PATH = path.join(process.cwd(), "proto/comments.proto");
export const COMMENTS_SERVICE_NAME = "CommentsService";

export const DEFAULT_TAKE_COMMENTS = 10;
export const DEFAULT_SKIP_COMMENTS = 0;
export const DEFAULT_COMMENT_STATE = CommentStateEnum.ACTIVE;

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export enum COMMENTS_SERVICE_METHODS {
    CREATE_COMMENT = "CreateComment",
    UPDATE_COMMENT = "UpdateComment",
    DELETE_COMMENT = "DeleteComment",
    GET_COMMENTS_ITEM = "GetComments",
    GET_COMMENT = "GetComment"
}