import { Posts } from "src/entities";

export class PostCreateDTO implements Partial<Omit<Posts, "id" | "createdAt">> {
    user_id: string;
    title?: string;
    desc?: string;
}