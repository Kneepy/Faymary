import type { Attachment as BaseAttachment, Message as BaseMessage } from "~/api";

export namespace DraftsMessages {
    export interface Store {
        drafts: NewMessage[]
    }

    export interface NewMessage {
        /**
         * Новое сообщение
         */
        message: string

        /**
         * Файлы которые прикрепил пользователь
         * Потом эти файлы будут переделаны во вложения (attachments)
         */
        files: File[]

        /**
         * Если это черновик для ещё не созданного диалога то надо в качестве id указать ANONYMOUS_DIALOG
         */
        dialog_id: string
    }

    export interface Attachment extends Omit<BaseAttachment, "id"> {}

    export interface PrepareMessage extends Omit<BaseMessage, "id" | "attachments"> {
        attachments: Attachment[]
    }

    export const ANONYMOUS_DIALOG = "ANONYMOUS_DIALOG"
}