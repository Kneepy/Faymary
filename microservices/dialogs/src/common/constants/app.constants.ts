import * as path from "path";

export const MODULE_PACKAGE_NAME = "dialogs";
export const MODULE_PORT = 5003
export const MODULE_HOST = `[::]:${MODULE_PORT}`
export const DIALOG_PROTO_PATH = path.join(
    process.cwd(),
    "proto/dialogs.proto"
);

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export const DEFAULT_TAKE_DIALOGS = 12;
export const DEFAULT_SKIP_DIALOGS = 0;

export const DEFAULT_TAKE_PARTICIPANTS_DIALOG = 5
export const DEFAULT_SKIP_PARTICIPANTS_DIALOG = 0

export const DEFAULT_TAKE_HISTORY_DIALOG = 20;
export const DEFAULT_SKIP_HISTORY_DIALOG = 0;

export const DIALOGS_SERVICE_NAME = "DialogsService";
export enum DIALOGS_SERVICE_METHODS {
    ADD_USER_TO_DIALOG = "AddUserToDialog",
    DELETE_DIALOG = "DeleteDialog",
    GET_DIALOG = "GetDialog",
    GET_ALL_USER_DIALOGS = "GetAllUserDialogs",
    SEARCH_USER_DIALOGS = "SearchUserDialogs",
    CREATE_DIALOG = "CreateDialog",
    GET_PARTICIPANTS_DIALOG = "GetParticipantsDialog",
    GET_ALL_PARTICIPANTS_DIALOG = "GetAllParticipantsDialog",
    GET_ALL_INTERLOCUTORS_USER = "getAllInterlocutorsUser",
    REMOVE_USER_DIALOG = "RemoveUserDialog",
    CHANGE_NAME_DIALOG = "ChangeNameDialog",
    GET_HISTORY_DIALOG = "GetHistoryDialog",
    CHANGE_FILE_DIALOG = "ChangeFileDialog",
    DIALOG_INCLUDE_USER = "DialogIncludesUser"
}