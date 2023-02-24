import { NotificationEnumType, Notifications } from "src/common";

export class NotificationCreateDTO
    implements Omit<Notifications, "id" | "createdAt">
{
    from_id: string;
    to_id: string;
    item_id: string;
    type: NotificationEnumType;
}
