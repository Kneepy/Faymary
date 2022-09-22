import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsOptional } from "class-validator";
import { Users } from "src/entity";

export class CreateDialgDto {
    @Type(() => Users)
    @ArrayMinSize(1)
    @IsNotEmpty()
    users: Users[]

    @IsOptional()
    title: string
}