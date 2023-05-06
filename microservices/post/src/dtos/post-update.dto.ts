import { Posts } from "src/entities";

export class PostUpdateDTO implements Omit<Posts, "user_id" | "createdAt"> {
    msg: string;
    id: string;
    user_id: string;
    file_ids: string;
}