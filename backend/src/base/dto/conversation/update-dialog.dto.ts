import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Dialogs, Files, Users } from "src/entity";

export class UpdateDialogDTO implements Pick<Dialogs, "title" | "frontFile" | "creator"> {
    @IsOptional()
    title?: string;

    @Type(() => Files)
    @IsOptional()
    frontFile: Files;

    @Type(() => Users)
    @IsOptional()
    creator: Users;
    
    @IsNotEmpty()
    dialogId: string
}