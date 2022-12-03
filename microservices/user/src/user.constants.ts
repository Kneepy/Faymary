import * as path from "path";
import {RpcException} from "@nestjs/microservices";

export const USER_PACKAGE_NAME = "user"
export const USER_PROTO_PATH = path.join(process.cwd(), "proto/user.proto")

export const USER_SERVICE = "UserService"
export enum USER_SERVICE_METHODS {
    FIND_USER = "FindUser",
    FOLLOW_USER = "FollowUser",
    USER_IS_FOLLOW = "UserIsFollow"
}

export const USER_ID_NOT_FOUND = new RpcException("Идентификатор пользователя не найден")