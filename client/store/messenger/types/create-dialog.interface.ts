import type { User } from "~/api";

export interface CreateDialogInterface {
    /**
     * Пользователи выбранные при поиске
     */
    selectedUsers: User[]

    /**
     * Все пользователи найденные во время поиска
     */
    resultSearch: User[]

    /**
     * Данные поля ввода
     */
    inputSearch: string

    /**
     * Новое сообщение которое будет отправлено всем новым пользователям диалога
     */
    message: string
}