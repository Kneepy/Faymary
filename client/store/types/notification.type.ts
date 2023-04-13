import { Addition, AdditionsType } from "./additions.type";

export enum NotificationEnumType {
    ADD_COMMENT = 0,
    DELETE_USER_FROM_DIALOG = 1,
    DELETE_DIALOG = 2,
    SUB_USER = 3,
    ADD_LIKE = 4,
}

export interface Notification {
    id: string;
    type: AdditionsType;
    item_id: string;
    item: Addition
    parent_id: string;
    parent_type: AdditionsType;
    parent: Addition
    from_id: string;
    to_id: string;
    createdAt: string;
    notification_type: NotificationEnumType;
}