import { Story } from "src/entities";

export interface StoryCreateInterface extends Omit<Story, "id" | "createdAt"> {}