import * as path from "path";

export const MODULE_PACKAGE_NAME = "profiles";
export const MODULE_PORT = 5012
export const MODULE_HOST = `[::]:${MODULE_PORT}`
export const PROFILES_PROTO_PATH = path.join(
    process.cwd(),
    "proto/profiles.proto"
);

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export const PROFILES_SERVICE_NAME = "ProfilesService";
export enum PROFILES_SERVICE_METHODS { 
    CREATE_PROFILE = "CreateProfile",
    GET_PROFILE = "GetProfile",
    UPDATE_PROFILE = "UpdateProfile",
    ADD_USER_ACCOUNT = "AddUserAccount",
    REMOVE_USER_ACCOUNT = "RemoveUserAccount"
}
