import { Mark, Story } from "src/entities";

export class UpdateStoryDTO implements Omit<Story, "createdAt"> {
    user_id: string;
    id: string;
    file_id: string;
    marks: Mark[];
}
