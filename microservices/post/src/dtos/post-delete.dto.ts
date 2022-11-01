import { Posts } from "src/entities";

export class PostDeleteDTO implements Pick<Posts, "id"> {
    id: string;
}