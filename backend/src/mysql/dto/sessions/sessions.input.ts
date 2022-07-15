import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Users } from "src/entity";

export class SessionsInput {
    @IsNotEmpty()
    @Type(() => Users)
    user: Users;

    @IsNotEmpty()
    ip: string;

    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    ua: string;
}
