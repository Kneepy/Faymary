import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Users } from "src/entity/users.entity";
import { NotificationEnumType } from "src/mysql/enums";

export class NotificationInput {
    @Type(() => Users)
    @IsNotEmpty()
    user: Users;

    @Type(() => Users)
    @IsNotEmpty()
    sender: Users;

    @IsNotEmpty()
    type: NotificationEnumType;
}
