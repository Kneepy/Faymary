import * as path from "path";

export const MODULE_PACKAGE_NAME = "profiles";
export const MODULE_PORT = 5012
export const MODULE_HOST = `localhost:${MODULE_PORT}`
export const PROFILES_PROTO_PATH = path.join(
    process.cwd(),
    "proto/profiles.proto"
);

export const DB_TYPE = "postgres"
export const DB_HOST = "127.0.0.1"
export const DB_PORT = 5432
export const DB_USERNAME = "postgres"
export const DB_PASSWORD = "postgres"
export const DB = "profiles"

export const PROFILES_SERVICE_NAME = "ProfilesService";
export enum PROFILES_SERVICE_METHODS { 
    CREATE_PROFILE = "CreateProfile",
    GET_PROFILE = "GetProfile",
    UPDATE_PROFILE = "UpdateProfile",
    ADD_USER_ACCOUNT = "AddUserAccount",
    REMOVE_USER_ACCOUNT = "RemoveUserAccount"
}
