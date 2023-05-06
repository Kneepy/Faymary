import { Story } from "src/entities";

export class GetStoriesDTO implements Pick<Story, "user_id"> {
    user_id: string;
}

export class GetStoryDTO implements Pick<Story, "id">  {
    id: string;
}
