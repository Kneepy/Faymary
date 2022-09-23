import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { Likes } from "src/entity";
import { DeepPartial } from "typeorm";

export class PostsArgs {
    @IsOptional()
    @IsUUID()
    @IsString()
    id?: string;

    @Type(() => Likes)
    likes?: DeepPartial<Likes>
}
