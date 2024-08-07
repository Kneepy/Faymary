import type { Dialog as BaseDialog, Message } from "~/api";

export namespace Messenger {

    export interface Store {
        /**
         * Все чаты пользователя
         */
        dialogs: Dialog[]

        /**
         * ID текущего чата пользователя
         */
        currentDialog: string
    }

    export interface Dialog extends BaseDialog {
        messages?: Message[]
        lastMessage?: Message
    }
}