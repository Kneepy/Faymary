import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Users, Files, Dialogs } from "src/entity";

export class MessagesInput {
    @IsString()
    @IsNotEmpty()
    message: string

    @IsNotEmpty()
    @Type(() => Users)
    user: Users

    @IsNotEmpty()
    @Type(() => Dialogs)
    dialog: Dialogs

    @Type(() => Files)
    @IsOptional()
    files: Files[]
}