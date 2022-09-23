import { Type } from "class-transformer"
import { IsOptional, IsString } from "class-validator"
import { Users } from "src/entity"

export class LikesArgs {
    @IsString()
    @IsOptional()
    id?: string

    @Type(() => Users)
    @IsOptional()
    user?: Partial<Users>
}