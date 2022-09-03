import { Type } from "class-transformer";
import { ActivityEnum } from "src/mysql";
import { Users } from "src/entity";
import { IsNotEmpty, IsOptional } from "class-validator";

export class ActivityInputCreate {
    @Type(() => Users)
    @IsNotEmpty()
    user: Users

    @IsNotEmpty()
    state: ActivityEnum
}

export class ActivityInputUpdate {
    @IsNotEmpty()
    state: ActivityEnum

    @IsOptional()
    start?: number

    @IsOptional()
    end?: number
}