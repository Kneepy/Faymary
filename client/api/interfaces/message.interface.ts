import { type Addition, type User } from "~/api";

export interface Message {
    id: string;
    attachments?: Addition;
    dialog_id: string;
    user: User
    user_id: string;
    msg: string;
    createdAt: string;
}