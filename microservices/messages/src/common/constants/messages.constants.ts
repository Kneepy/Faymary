import * as path from "path";

export const MODULE_PACKAGE_NAME = "messages";
export const MESSAGES_PROTO_PATH = path.join(
    process.cwd(),
    "proto/messages.proto"
);

export const MYSQL_PASS = "root";
export const MYSQL_USER = "root";
export const MYSQL_PORT = 3306;
export const MYSQL_HOST = "localhost";

export const DEFAULT_SKIP_MESSAGES = 0;
export const DEFAULT_TAKE_MESSAGES = 20;

export const MESSAGES_SERVICE_NAME = "MessagesSerivce";
export enum MESSAGES_SERVICE_METHODS {
    CREATE_MESSAGE = "CreateMessage",
    GET_DIALOG_MESSAGES = "GetDialogMessages",
    UPDATE_MESSAGE = "UpdateMessage",
    DELETE_MESSAGE = "DeleteMessage",
}
