import * as path from "path";

export const MODULE_PACKAGE_NAME = "dialogs";
export const DIALOG_PROTO_PATH = path.join(
    process.cwd(),
    "proto/dialogs.proto"
);

export const MYSQL_PASS = "root";
export const MYSQL_USER = "root";
export const MYSQL_PORT = 3306;
export const MYSQL_HOST = "localhost";

export const DEFAULT_TAKE_DIALOGS = 12;

export const DEFAULT_SKIP_DIALOGS = 0;

export const DEFAULT_TAKE_HISTORY_DIALOG = 20;
export const DEFAULT_SKIP_HISTORY_DIALOG = 0;

export const DIALOGS_SERVICE_NAME = "DialogsService";
export enum DIALOGS_SERVICE_METHODS {
    ADD_USER_TO_DIALOG = "AddUserToDialog",
    DELETE_DILAOG = "DeleteDialog",
    GET_DIALOG = "GetDialog",
    GET_ALL_USER_DIALOGS = "GetAllUserDialogs",
    CREATE_DIALOG = "CreateDialog",
    REMOVE_USER_DIALOG = "RemoveUserDialog",
    CHANGE_NAME_DIALOG = "ChangeNameDialog",
    GET_HISTORY_DIALOG = "GetHistoryDialog",
    CHANGE_FILE_DIALOG = "ChangeFileDialog"
}