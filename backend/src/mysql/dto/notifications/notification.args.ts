import { Type } from "class-transformer"
import { IsOptional, IsString } from "class-validator"
import { Users } from "src/entity"
import { NotificationEnumType } from "src/mysql/enums"

export class NotificationArgs {
    @IsString()
    @IsOptional()
    id: string

    @Type(() => Users)
    @IsOptional()
    from: Users

    @Type(() => Users)
    @IsOptional()
    to: Users

    @IsOptional()
    type: NotificationEnumType
}