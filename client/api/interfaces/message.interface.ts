import { AdditionsType } from "~/api";

export interface Attachment {
    item_id: string
    type: AdditionsType
    id: string
}

export interface Message {
    id: string;
    attachments?: Attachment[];
    dialog_id: string;
    user_id: string;
    msg: string;
    createdAt: string;
}