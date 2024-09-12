import * as path from "path";

export const MODULE_PACKAGE_NAME = "notifications";
export const MODULE_PORT = 5005
export const MODULE_HOST = `[::]:${MODULE_PORT}`
export const NOTIFICATION_PROTO_PATH = path.join(
    process.cwd(),
    "proto/notification.proto"
);

export const DEFAULT_TAKE_NOTIFICATIONS = 15;
export const DEFAULT_ORDER_NOTIFICATIONS = 0;
export const NOTIFICATION_LIFETIME = 86400000; // 24h

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export const NOTIFICATIONS_SERVICE_NAME = "NotificationsService";
export enum NOTIFICATION_SERVICE_METHODS {
    GET_ALL_USER_NOTIFICATIONS = "GetAllUserNotifications",
    CREATE_NOTIFICATION = "CreateNotification"
}
