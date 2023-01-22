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

export const DIALOGS_SERVICE_NAME = "DialogsService";
export enum DIALOGS_SERVICE_METHODS {
}
