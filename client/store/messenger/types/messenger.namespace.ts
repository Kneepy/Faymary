import type { Dialog, Message } from "~/api";

export namespace Messenger {

    export interface Store {
        dialogs: CustomDialog[]
    }

    export interface CustomDialog extends Dialog {
        messages: Message[]
    }

}