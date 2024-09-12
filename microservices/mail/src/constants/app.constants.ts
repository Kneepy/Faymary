import * as path from "path"

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export const LIFE_TIME_ACCESS_CODE = 300000; // 5 min

export const MODULE_PACKAGE_NAME = "mail"
export const MODULE_PORT = 5011;
export const MODULE_HOST = `[::]:${MODULE_PORT}`
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