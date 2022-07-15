import { Type } from "class-transformer";
import { Users } from "src/entity";

export class SessionsArgs {
    id: number;

    @Type(() => Users)
    user: Users;
}
