import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Users, Files } from "src/entity";

export class MessagesInput {
    @IsString()
    @IsNotEmpty()
    message: string

    @IsNotEmpty()
    @Type(() => Users)
    user: Users

    @Type(() => Files)
    @IsOptional()
    files: Files[]
}