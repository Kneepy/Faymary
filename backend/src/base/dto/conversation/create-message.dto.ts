import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Files, Messages } from "src/entity";

export class CreateMessageDto extends Messages {
    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsString()
    dialogId: string

    @Type(() => Files)
    @IsOptional()
    files: Files[]
}