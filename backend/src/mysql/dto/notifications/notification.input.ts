import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { NotificationPayload } from "src/entity";
import { Users } from "src/entity/users/users.entity";
import { NotificationEnumType } from "src/mysql/enums";

export class NotificationInput extends NotificationPayload {
    @Type(() => Users)
    @IsNotEmpty()
    to: Users;

    @Type(() => Users)
    @IsNotEmpty()
    from: Users;

    @IsNotEmpty()
    type: NotificationEnumType;
}
