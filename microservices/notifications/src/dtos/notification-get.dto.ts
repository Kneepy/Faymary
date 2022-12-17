export class NotificationGetDTO {
    user_id: string;

    // от скольки начинаем вборку
    skip?: number;

    // и сколько берём
    take?: number;
}
