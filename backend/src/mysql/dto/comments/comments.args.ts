import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { Posts, Users } from "src/entity";

export class CommentsArgs {
    @IsOptional()
    @IsUUID()
    @IsString()
    id: string;

    @Type(() => Users)
    @IsOptional()
    user: Users;

    @Type(() => Posts)
    @IsOptional()
    post: Posts;
}
