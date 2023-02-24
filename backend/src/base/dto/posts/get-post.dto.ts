import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Posts } from "src/entity";
import { FindOptionsRelations } from "typeorm";

export class GetPostDto {
    @IsOptional()
    relations: FindOptionsRelations<Posts>;

    @IsString()
    @IsNotEmpty()
    id: string;
}
