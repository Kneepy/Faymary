import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Files, Users } from "src/entity";
import { Story } from "src/entity/stories";

export class AddStoryDTO implements Pick<Story, "file" | "user"> {
    @Type(() => Files)
    @IsNotEmpty()
    file: Files;

    @Type(() => Users)
    @IsNotEmpty()
    user: Users;
}