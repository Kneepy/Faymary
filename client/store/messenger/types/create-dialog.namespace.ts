import type { Attachment, User } from "~/api";

export namespace CreateDialog {
    export interface Store {
        /**
         * Пользователи выбранные при поиске
         */
        selectedUsers: CustomUser[]

        /**
         * Все пользователи найденные во время поиска
         */
        resultSearch: CustomUser[]

        /**
         * Данные поля ввода
         */
        inputSearch: string

        /**
         * Новое сообщение которое будет отправлено всем новым пользователям диалога
         */
        message: string

        /**
         * Файлы которые прикрепил пользователь
         * Потом эти файлы будут переделаны во вложения (attachments)
         */
        files: File[]
    }
    export interface CustomUser extends Omit<User, "password" | "profile" | "state"> {}
    export interface CustomAttachment extends Omit<Attachment, "id"> {}
}
