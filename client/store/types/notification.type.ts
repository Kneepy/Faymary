import { AdditionsEnum } from "./additions.enum";

export enum NotificationEnumType {
    ADD_COMMENT = 0,
    DELETE_USER_FROM_DIALOG = 1,
    DELETE_DIALOG = 2,
    SUB_USER = 3,
    ADD_LIKE = 4,
}

export interface Notification {
    id: string;
    type: AdditionsEnum;
    item_id: string;
    to_id: string;
    parent_id: string;
    parent_type: AdditionsEnum;
    from_id: string;
    createdAt: string;
    notification_type: NotificationEnumType;
}