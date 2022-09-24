import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { DeepPartial } from "typeorm";

export class PostsArgs {
    @IsOptional()
    @IsUUID()
    @IsString()
    id?: string;
}
