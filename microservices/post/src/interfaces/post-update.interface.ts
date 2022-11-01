import { Posts } from "src/entities";

export interface PostUpdateData extends Omit<Posts, "id" | "createdAt"> {}