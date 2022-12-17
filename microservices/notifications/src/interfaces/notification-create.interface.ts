import { Notifications } from "src/common";

export interface NotificationCreateInterface
    extends Omit<Notifications, "id" | "createdAt"> {}
