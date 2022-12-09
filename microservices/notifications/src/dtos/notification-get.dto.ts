import {
    DEFAULT_ORDER_NOTIFICATIONS,
    DEFAULT_TAKE_NOTIFICATIONS
} from "src/common";

export class NotificationGetDTO {
    user_id: string;

    // от скольки начинаем вборку
    skip?: number = DEFAULT_ORDER_NOTIFICATIONS;

    // и сколько берём
    take?: number = DEFAULT_TAKE_NOTIFICATIONS;
}
