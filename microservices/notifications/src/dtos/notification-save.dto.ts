import { NotificationAdditionsEnumType, NotificationEnumType, Notifications } from "src/common";

export class NotificationCreateDTO
    implements Omit<Notifications, "id" | "createdAt">
{
    notification_type: NotificationEnumType;
    parent_id: string;
    parent_type: NotificationAdditionsEnumType;
    from_id: string;
    to_id: string;
    item_id: string;
    type: NotificationAdditionsEnumType;
}
