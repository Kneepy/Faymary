import { Posts } from "src/entities";

export class PostUpdateDTO implements Partial<Omit<Posts, "id" | "createdAt">> {
    user_id: string;
    title?: string;
    desc?: string;
}