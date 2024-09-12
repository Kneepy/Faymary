import { IsNotEmpty } from "class-validator";

export class AddLikeStoryDTO {
    @IsNotEmpty()
    storyId: string
}