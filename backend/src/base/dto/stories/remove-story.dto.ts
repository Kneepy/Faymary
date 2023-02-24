import { IsNotEmpty } from "class-validator";

export class RemoveStoryDTO {
    @IsNotEmpty()
    storyId: string
}