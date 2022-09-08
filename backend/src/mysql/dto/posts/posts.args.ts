import { IsOptional, IsString, IsUUID } from "class-validator";

export class PostsArgs {
    @IsOptional()
    @IsUUID()
    @IsString()
    id: string
}