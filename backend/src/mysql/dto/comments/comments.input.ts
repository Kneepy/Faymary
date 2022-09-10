import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsString } from "class-validator";
import { Files, Users } from "src/entity";

export class CommentsInput {
    @IsNotEmpty()
    @IsString()
    title: string;

    @Type(() => Files)
    @ArrayMinSize(1)
    @IsNotEmpty()
    files: Files[];

    @IsNotEmpty()
    @IsString()
    desc: string;

    @Type(() => Users)
    @IsNotEmpty()
    user: Users;
}
