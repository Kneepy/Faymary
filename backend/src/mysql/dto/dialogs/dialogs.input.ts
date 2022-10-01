import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsOptional } from "class-validator";
import { Users } from "src/entity";

export class DialogsInput {
    @Type(() => Users)
    @ArrayMinSize(1)
    users: Users[]

    @IsNotEmpty()
    @Type(() => Users)
    creator: Users

    @IsOptional()
    title: string
}