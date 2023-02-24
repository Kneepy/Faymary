import * as path from "path";
import { LikeStateEnum } from "../enums/like-state.enum";

export const MODULE_PORT = 5001;
export const MODULE_PACKAGE_NAME = "likes";
export const MODULE_HOST = `localhost:${MODULE_PORT}`;
export const DIALOG_PROTO_PATH = path.join(
    process.cwd(),
    "proto/likes.proto"
);

export const DEFAULT_TAKE_LIKES = 20;
export const DEFAULT_SKIP_LIKES = 0;

export const DEFAULT_LIKE_STATE = LikeStateEnum.ACTIVE;

export const LIKES_SERVICE_NAME = "LikesService";

export const MYSQL_PASS = "root";
export const MYSQL_USER = "root";
export const MYSQL_PORT = 3306;
export const MYSQL_HOST = "localhost";

export enum  SERVICE_METHODS {
    ADD_LIKE = "AddLike"
}