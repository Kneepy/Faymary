import { Notifications } from "../notifications.entity";

export interface NotificationCreateInterface
    extends Omit<Notifications, "id" | "createdAt"> {}
