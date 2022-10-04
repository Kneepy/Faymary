import { Type } from "class-transformer";
import { IsString } from "class-validator";
import { Users } from "src/entity";

export class DialogsArgs {
    @IsString()
    id: string;
}

export class ManyDialogsArgs {
    @Type(() => Users)
    users: Users[] | Users;
}
