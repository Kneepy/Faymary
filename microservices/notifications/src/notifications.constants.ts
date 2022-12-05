import * as path from "path";

export const MODULE_PACKAGE_NAME = "notifications";
export const NOTIFICATION_PROTO_PATH = path.join(
    process.cwd(),
    "proto/notification.proto"
);

export const MYSQL_PASS = "root";
export const MYSQL_USER = "root";
export const MYSQL_PORT = 3306;
export const MYSQL_HOST = "localhost";

export const NOTIFICATIONS_SERVICE_NAME = "NotificationSerivce"
