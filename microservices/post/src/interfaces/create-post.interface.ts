import { Posts } from "src/entities";

export interface PostCreationData extends Omit<Posts, "id" | "createdAt"> {
}