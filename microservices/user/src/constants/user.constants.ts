import * as path from "path";

export const USER_PACKAGE_NAME = "user"
export const USER_PROTO_PATH = path.join(process.cwd(), "proto/user.proto")

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
