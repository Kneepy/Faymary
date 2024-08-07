import * as path from "path";

export const MODULE_PACKAGE_NAME = "attachments";
export const MODULE_PORT = 5013
export const MODULE_HOST = `[::]:${MODULE_PORT}`
export const DIALOG_PROTO_PATH = path.join(
    process.cwd(),
    "proto/attachments.proto"
);

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export const ATTACHMENT_SERVICE_NAME = "AttachmentService";
export enum ATTACHMENT_SERVICE_METHODS {

}