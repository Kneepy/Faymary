import { Mark, Story } from "src/entities";

export class UpdateStoryDTO implements Pick<Story, "file_id" | "marks"> {
    file_id: string;
    marks: Mark[];
}
