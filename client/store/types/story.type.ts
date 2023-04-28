import { Addition, AdditionsType } from "./additions.type";
import { User } from "./user.type";


export interface Mark {
    id: string;
    item_id: string;
    type: AdditionsType;
    attachment: Addition
}
export interface Story {
    id: string;
    user_id: string;
    createdAt: string;
    file_id: string;
    marks: Mark[];
}
export interface UserStories {
    user: User
    stories: Story[]
}
