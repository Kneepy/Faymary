import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Story } from "src/entity";

export class AddReferenceStoryDTO {
    @IsNotEmpty()
    storyId: string

    @IsNotEmpty()
    @Type(() => Story)
    reference: Story
}