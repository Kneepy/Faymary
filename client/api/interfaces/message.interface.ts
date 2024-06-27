import { AdditionsType } from "~/api";

export interface Message {
    id: string;
    attachment?: AdditionsType;
    item_id?: string;
    dialog_id: string;
    user_id: string;
    msg: string;
    createdAt: string;
}