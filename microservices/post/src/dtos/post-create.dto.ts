import { Posts } from "src/entities";

export class PostCreateDTO implements Omit<Posts, "id" | "createdAt"> {
    file_ids: string;
    user_id: string;
    title: string;
    desc: string;
}