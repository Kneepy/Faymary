import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Dialogs, Users } from "src/entity";

export class RelationshipsInput {
    @Type(() => Dialogs)
    @IsNotEmpty()
    dialog: Dialogs;

    @Type(() => Users)
    @IsNotEmpty()
    emitter: Users;

    @Type(() => Users)
    @IsNotEmpty()
    subject: Users;
}
