import { Mark, Story } from "src/entities";

type CreateMarkType = Omit<Mark, "id" | "story">[]

export class CreateStoryDTO implements Omit<Story | {marks: CreateMarkType}, "id" | "createdAt"> {
    marks: CreateMarkType
    user_id: string;
    file_id: string;
}