import * as path from "path"

export const MYSQL_PASS = "root";
export const MYSQL_USER = "root";
export const MYSQL_PORT = 3306;
export const MYSQL_HOST = "localhost";
export const MYSQL_DB = "access_codes";

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
    PASS = "rhwdejvnmlrfgtgn",
    USER = "ilyafamin4@gmail.com"
}