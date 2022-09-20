import { Type } from "class-transformer";
import { ArrayMinSize } from "class-validator";
import { Users } from "src/entity";

export class DialogsInput {
    @Type(() => Users)
    @ArrayMinSize(1)
    users: Users[]
}