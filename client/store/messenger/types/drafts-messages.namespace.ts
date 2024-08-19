import type { Message } from "~/api";

export namespace DraftsMessages {
    export interface Store {
        drafts: Draft[]
    }

    export interface CustomFile extends File {
        // ссылка на blob
        href: string
    }

    export interface Draft {
        /**
         * Новое сообщение
         */
        message: string

        /**
         * Файлы которые прикрепил пользователь
         * Потом эти файлы будут переделаны во вложения (attachments)
         */
        files: CustomFile[]

        /**
         * Если это черновик для ещё не созданного диалога то надо в качестве id указать ANONYMOUS_DIALOG
         */
        dialog_id: string
    }

    export interface PreparedMessage extends Pick<Message, "attachments" | "dialog_id" | "msg"> {}

    export const ANONYMOUS_DIALOG = "ANONYMOUS_DIALOG"
}