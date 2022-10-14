import * as path from "path";

export const USER_PACKAGE_NAME = "user"
export const USER_PROTO_PATH = path.join(process.cwd(), "proto/user.proto")

export const USER_SERVICE = "UserService"
export enum USER_SERVICE_METHODS {
    FIND_USER = "FindUser",
    FOLLOW_USER = "FollowUser"
}