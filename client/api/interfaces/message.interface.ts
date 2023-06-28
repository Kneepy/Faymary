import { AdditionsType } from "./additions.interface";

export interface Message {
    id: string;
    attachment?: AdditionsType;
    item_id?: string;
    dialog_id: string;
    user_id: string;
    msg: string;
    createdAt: string;
}