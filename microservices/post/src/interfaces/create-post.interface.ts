import { Posts } from "src/entities";

export interface PostCreationData extends Omit<Partial<Posts>, "id" | "createdAt"> {
}