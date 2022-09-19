import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Files } from "src/entity";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    desc: string;

    @IsNotEmpty()
    @Type(() => Files)
    files: Files[];
}
