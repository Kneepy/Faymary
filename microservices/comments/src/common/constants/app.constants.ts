import * as path from "path";
import {CommentStateEnum} from "../enums";

export const MODULE_PACKAGE_NAME = "comments";
export const COMMENTS_PROTO_PATH = path.join(process.cwd(), "proto/comments.proto");

export const COMMENTS_SERVICE_NAME = "CommentsService";

export const DEFAULT_TAKE_COMMENTS = 10;
export const DEFAULT_SKIP_COMMENTS = 0;
export const DEFAULT_COMMENT_STATE = CommentStateEnum.ACTIVE;

export const MYSQL_PASS = "root";
export const MYSQL_USER = "root";
export const MYSQL_PORT = 3306;
export const MYSQL_HOST = "localhost";

export enum COMMENTS_SERVICE_METHODS {
    CREATE_COMMENT = "CreateComment",
    UPDATE_COMMENT = "UpdateComment",
    DELETE_COMMENT = "DeleteComment",
    GET_COMMENTS_ITEM = "GetComments"
}