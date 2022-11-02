import { Posts } from "src/entities";

export class PostUpdateDTO implements Omit<Partial<Posts>, "user_id" | "createdAt"> {
    id: string
    user_id: string;
    title?: string;
    desc?: string;
}