import * as path from "path";

export const MODULE_PACKAGE_NAME = "notifications";
export const MODULE_PORT = 5005
export const MODULE_HOST = `localhost:${MODULE_PORT}`
export const NOTIFICATION_PROTO_PATH = path.join(
    process.cwd(),
    "proto/notification.proto"
);

export const DEFAULT_TAKE_NOTIFICATIONS = 15;
export const DEFAULT_ORDER_NOTIFICATIONS = 0;
export const NOTIFICATION_LIFETIME = 86400000; // 24h

export const DB_TYPE = "postgres"
export const DB_HOST = "127.0.0.1"
export const DB_PORT = 5432
export const DB_USERNAME = "postgres"
export const DB_PASSWORD = "postgres"
export const DB = "notifications"

export const NOTIFICATIONS_SERVICE_NAME = "NotificationsService";
export enum NOTIFICATION_SERVICE_METHODS {
    GET_ALL_USER_NOTIFICATIONS = "GetAllUserNotifications",
    CREATE_NOTIFICATION = "CreateNotification"
}
