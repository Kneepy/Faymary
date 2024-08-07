import type { Attachment as BaseAttachment, User as BaseUser } from "~/api";
import { type Messenger } from "~/store";

export namespace CreateDialog {
    export interface Store {
        /**
         * Пользователи выбранные при поиске
         */
        selectedUsers: User[]

        /**
         * Все пользователи найденные во время поиска
         */
        resultSearch: {
            // это пользователи с которыми уже есть диалог
            existing: User[]
            // это юзеры с которыми нет диалога
            nonexistent: User[]
        }

        /**
         * Данные поля ввода
         */
        inputSearch: string
    }

    export interface User extends Omit<BaseUser, "password" | "profile" | "state"> {}
}
