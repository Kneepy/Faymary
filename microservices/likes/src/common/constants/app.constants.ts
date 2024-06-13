import * as path from "path";
import { LikeStateEnum } from "../enums/like-state.enum";

export const MODULE_PORT = 5001;
export const MODULE_PACKAGE_NAME = "likes";
export const MODULE_HOST = `localhost:${MODULE_PORT}`;
export const LIKES_PROTO_PATH = path.join(
    process.cwd(),
    "proto/likes.proto"
);

export const DEFAULT_TAKE_LIKES = 20;
export const DEFAULT_SKIP_LIKES = 0;

export const DEFAULT_LIKE_STATE = LikeStateEnum.ACTIVE;

export const LIKES_SERVICE_NAME = "LikesService";

export const DB = "likes"
export const DB_TYPE = "postgres"
export const DB_HOST = "127.0.0.1"
export const DB_PORT = 5432
export const DB_USERNAME = "postgres"
export const DB_PASSWORD = "postgres"

export enum  SERVICE_METHODS {
    ADD_LIKE = "AddLike",
    GET_COUNT_LIKES = "GetCountLikes",
    CHECK_LIKE = "CheckLike"
}