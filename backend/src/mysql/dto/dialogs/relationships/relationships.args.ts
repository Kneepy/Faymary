import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { Dialogs, Users } from "src/entity";

export class ManyRelationshipsArgs {
    @Type(() => Dialogs)
    @IsOptional()
    dialog: Dialogs

    @Type(() => Users)
    @IsOptional()
    emitter: Users

    @Type(() => Users)
    @IsOptional()
    subject: Users
}

export class RelationshipsArgs {
    @IsOptional()
    id: string
}