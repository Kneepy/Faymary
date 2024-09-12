import { Posts } from "src/entities";

export class PostDeleteDTO implements Pick<Posts, "id" | "user_id"> {
    user_id: string
    id: string;
}