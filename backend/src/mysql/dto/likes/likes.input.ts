import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Users } from "src/entity";

export class LikesInput {
    @IsNotEmpty()
    @Type(() => Users)
    user: Users
}