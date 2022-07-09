import { IsArray, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { Users, Messages } from "src/entity";

export class DialogsInput {
    @IsArray()
    @ArrayMinSize(2)
    @Type(() => Users)
    users: Users[];

    @Type(() => Messages)
    message: Messages[];
}
