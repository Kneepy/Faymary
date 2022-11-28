import { Story } from "src/entities";

export class DeleteStoryDTO implements Pick<Story, "id"> {
    id: string;
}
