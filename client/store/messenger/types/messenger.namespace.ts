import type { Dialog, Message } from "~/api";

export namespace Messenger {

    export interface Store {
        /**
         * Все чаты пользователя
         */
        dialogs: CustomDialog[]

        /**
         * ID текущего чата пользователя
         */
        currentDialog: string
    }

    export interface CustomDialog extends Dialog {
        messages: Message[]
    }

}