import { AdditionsType } from "./additions.type";

export enum CommentState {
    UNACTIVE = 0,
    ACTIVE = 1,
}
export interface Comment {
    id: string;
    msg: string;
    file_ids: string[];
    user_id: string;
    item_id: string;
    type: AdditionsType;
    createdAt: string;
    state: CommentState;
}