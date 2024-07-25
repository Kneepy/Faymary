import type { User } from "~/api";

export namespace CreateDialog {
    export interface Store {
        /**
         * Пользователи выбранные при поиске
         */
        selectedUsers: IUser[]

        /**
         * Все пользователи найденные во время поиска
         */
        resultSearch: IUser[]

        /**
         * Данные поля ввода
         */
        inputSearch: string

        /**
         * Новое сообщение которое будет отправлено всем новым пользователям диалога
         */
        message: string
    }
    export interface IUser extends Omit<User, "password" | "profile" | "state"> {}
}
