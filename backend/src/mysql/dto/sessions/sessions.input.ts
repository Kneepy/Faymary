import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Users } from "src/entity/users.entity";

export class SessionsInput {
    @IsNotEmpty()
    @Type(() => Users)
    user: Users;

    @IsNotEmpty()
    ip: string;

    @IsNotEmpty()
    fingerprint: string;

    @IsNotEmpty()
    ua: string;
}
