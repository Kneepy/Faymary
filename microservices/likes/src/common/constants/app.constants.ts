import * as path from "path";
import { LikeStateEnum } from "../enums/like-state.enum";

export const MODULE_PORT = 5001;
export const MODULE_PACKAGE_NAME = "likes";
export const MODULE_HOST = `[::]:${MODULE_PORT}`;
export const LIKES_PROTO_PATH = path.join(
    process.cwd(),
    "proto/likes.proto"
);

export const DEFAULT_TAKE_LIKES = 20;
export const DEFAULT_SKIP_LIKES = 0;

export const DEFAULT_LIKE_STATE = LikeStateEnum.ACTIVE;

export const LIKES_SERVICE_NAME = "LikesService";

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export enum  SERVICE_METHODS {
    ADD_LIKE = "AddLike",
    GET_COUNT_LIKES = "GetCountLikes",
    CHECK_LIKE = "CheckLike"
}