import { type Addition, AdditionsType, type User } from "~/api";

export interface Attachment {
    item_id: string
    type: AdditionsType
    id: string
}

export interface Message {
    id: string;
    attachments?: Addition;
    dialog_id: string;
    user: User
    user_id: string;
    msg: string;
    createdAt: string;
}