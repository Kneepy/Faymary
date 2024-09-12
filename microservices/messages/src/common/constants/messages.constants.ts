import * as path from "path";

export const MODULE_PACKAGE_NAME = "messages";
export const MODULE_PORT = 5004
export const MODULE_HOST = `[::]:${MODULE_PORT}`
export const MESSAGES_PROTO_PATH = path.join(
    process.cwd(),
    "proto/messages.proto"
);

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export const DEFAULT_SKIP_MESSAGES = 0;
export const DEFAULT_TAKE_MESSAGES = 20;

export const MESSAGES_SERVICE_NAME = "MessagesService";
export enum MESSAGES_SERVICE_METHODS {
    CREATE_MESSAGE = "CreateMessage",
    GET_DIALOG_MESSAGES = "GetDialogMessages",
    GET_LAST_DIALOG_MESSAGE = "GetLastDialogMessage",
    GET_MESSAGE = "GetMessage",
    UPDATE_MESSAGE = "UpdateMessage",
    DELETE_MESSAGE = "DeleteMessage",
}
