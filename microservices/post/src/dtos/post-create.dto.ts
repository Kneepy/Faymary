import { Posts } from "src/entities";

export class PostCreateDTO implements Omit<Posts, "id" | "createdAt"> {
    user_id: string;
    file_ids: string;
    msg: string;
}