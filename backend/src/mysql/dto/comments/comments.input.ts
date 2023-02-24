import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Files, Posts, Users } from "src/entity";

export class CommentsInput {
    @Type(() => Files)
    @IsOptional()
    files: Files[];

    @IsOptional()
    @IsString()
    message: string;

    @Type(() => Users)
    @IsNotEmpty()
    user: Users;

    @Type(() => Posts)
    @IsNotEmpty()
    post: Posts;
}
