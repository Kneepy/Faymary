import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Comments } from "src/entity";
import { FindOptionsRelations } from "typeorm";

export class GetCommentsDto {
    @IsNumber()
    @IsNotEmpty()
    take: number;

    @IsNumber()
    @IsNotEmpty()
    skip: number;

    @IsOptional()
    relations: FindOptionsRelations<Comments>;

    @IsString()
    @IsNotEmpty()
    postId: string;
}
