import { Story } from "src/entities";

export class DeleteStoryDTO implements Pick<Story, "id" | "user_id"> {
    user_id: string;
    id: string;
}
