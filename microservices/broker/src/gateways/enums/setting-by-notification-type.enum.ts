import { NotificationEnumType } from "src/proto/notification"
import { Profile } from "src/proto/profiles"


/**
 * @param settings
 * @returns Объект (key: NotificationsEnumType -> value) состоящий из пары ключ значение, где ключ это тип уведомления, а значение это
 * Соответсвующая ключу настройка из профиля пользователя и её значение
 */
export const GetSettingByNotificationType = (settings: Omit<Profile, "id" | "accounts" | "user_id">): {[k: number]: boolean} => {
    const settingByNotificationType = {}

    settingByNotificationType[NotificationEnumType.ADD_COMMENT] = settings.commentsNotification
    settingByNotificationType[NotificationEnumType.ADD_LIKE] = settings.likesNotification
    settingByNotificationType[NotificationEnumType.DELETE_DIALOG] = settings.deleteDialogNotifications
    settingByNotificationType[NotificationEnumType.DELETE_USER_FROM_DIALOG] = settings.exceptionsFromDialogsNotifications
    settingByNotificationType[NotificationEnumType.SUB_USER] = settings.subscriptionNotifications

    return settingByNotificationType
}