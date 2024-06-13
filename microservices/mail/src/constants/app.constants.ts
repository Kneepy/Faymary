import * as path from "path"

export const DB = "access_codes"
export const DB_TYPE = "postgres"
export const DB_HOST = "127.0.0.1"
export const DB_PORT = 5432
export const DB_USERNAME = "postgres"
export const DB_PASSWORD = "postgres"

export const LIFE_TIME_ACCESS_CODE = 300000; // 5 min

export const MODULE_PACKAGE_NAME = "mail"
export const MODULE_PORT = 5011;
export const MODULE_HOST = `localhost:${MODULE_PORT}`
export const MAIL_PROTO_PATH = path.join(process.cwd(), "proto/mail.proto")
export const MAIL_SERVICE_NAME = "MailService"
export enum MAIL_SERVICE_METHODS {
    SEND_ACCESS_CODE = "SendAccessCode",
    CONFIRM_ACCESS_CODE = "ConfirmAccessCode"
}

export const MAILER_SERVICE = "MAILER_SERVICE"
export enum SMTP {
    HOST = "smtp.gmail.com",
    PORT = 465,
    PASS = "lquxeopertpfsnew",
    USER = "kneepydev@gmail.com"
}