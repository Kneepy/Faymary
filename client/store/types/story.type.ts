import { AdditionsType } from "./additions.type";

export interface Story {
    id: string;
    user_id: string;
    createdAt: string;
    file_id: string;
    marks: Mark[];
}
  
export interface Mark {
    id: string;
    item_id: string;
    type: AdditionsType;
}