import * as path from "path";

export const MODULE_PACKAGE_NAME = "notifications";
export const NOTIFICATION_PROTO_PATH = path.join(
    process.cwd(),
    "proto/notification.proto"
);

export const DEFAULT_TAKE_NOTIFICATIONS = 15;
export const DEFAULT_ORDER_NOTIFICATIONS = 0;
export const NOTIFICATION_LIFETIME = 86400000; // 24h

export const MYSQL_PASS = "root";
export const MYSQL_USER = "root";
export const MYSQL_PORT = 3306;
export const MYSQL_HOST = "localhost";

export const NOTIFICATIONS_SERVICE_NAME = "NotificationSerivce";
export enum NOTIFICATION_SERVICE_METHODS {
    GET_ALL_USER_NOTIFICATIONS = "GetAllUserNotifications",
    CREATE_NOTIFICATION = "CreateNotification"
}
