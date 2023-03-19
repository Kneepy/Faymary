import * as path from "path";

export const MODULE_PACKAGE_NAME = "profiles";
export const MODULE_PORT = 5012
export const MODULE_HOST = `localhost:${MODULE_PORT}`
export const PROFILES_PROTO_PATH = path.join(
    process.cwd(),
    "proto/profiles.proto"
);

export const MYSQL_PASS = "root";
export const MYSQL_USER = "root";
export const MYSQL_PORT = 3306;
export const MYSQL_HOST = "localhost";

export const PROFILES_SERVICE_NAME = "ProfilesService";
export enum PROFILES_SERVICE_METHODS {
   GET_PROFILE = "GetProfile",
   UPDATE_PROFILE = "UpdateProfile",
   ADD_USER_ACCOUNT = "AddUserAccount",
   REMOVE_USER_ACCOUNT = "RemoveUserAccount"
}
