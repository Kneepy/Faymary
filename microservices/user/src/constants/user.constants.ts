import * as path from "path";
<<<<<<< HEAD
import {RpcException} from "@nestjs/microservices";
=======
>>>>>>> c64b367a04156823befc2705327eb7aeb553abd3

export const USER_PACKAGE_NAME = "user"
export const USER_PROTO_PATH = path.join(process.cwd(), "proto/user.proto")

<<<<<<< HEAD
export const USER_SERVICE = "UserService"
export enum USER_SERVICE_METHODS {
    FIND_USER = "FindUser",
    FOLLOW_USER = "FollowUser",
    USER_IS_FOLLOW = "UserIsFollow",
    CREATE_USER = "CreateUser"
}

export const USER_ID_NOT_FOUND = new RpcException("Идентификатор пользователя не найден")
=======
export const DEFAULT_TAKE_USERS = 10;
export const DEFAULT_SKIP_USERS = 0;
export const USER_SERVICE = "UserService"
export enum USER_SERVICE_METHODS {
    FIND_USER = "FindUser",
    FIND_USERS = "FindUsers",
    FOLLOW_USER = "FollowUser",
    USER_IS_FOLLOW = "UserIsFollow",
    USERS_IS_FOLLOW = "UsersIsFollow",
    CREATE_USER = "CreateUser",
    UPDATE_USER = "UpdateUser"
}
>>>>>>> c64b367a04156823befc2705327eb7aeb553abd3
