import * as path from "path";

export const MODULE_PACKAGE_NAME = "comments";
export const DIALOG_PROTO_PATH = path.join(
    process.cwd(),
    "proto/comments.proto"
);

export const LIKES_SERVICE_NAME = "CommentsService";

export const DEFAULT_TAKE_COMMENTS = 10;
export const DEFAULT_SKIP_COMMENTS = 0;

export const MYSQL_PASS = "root";
export const MYSQL_USER = "root";
export const MYSQL_PORT = 3306;
export const MYSQL_HOST = "localhost";

export enum  LIKES_SERVICE_METHODS {
}