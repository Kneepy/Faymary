import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { Dialogs, HistoryActions, Users } from "src/entity";
import { FindOptionsWhere } from "typeorm";

export class ManyRelationshipsArgs {
    @Type(() => Dialogs)
    @IsOptional()
    dialog?: Dialogs;

    @Type(() => Users)
    @IsOptional()
    emiter?: Users;

    @Type(() => Users)
    @IsOptional()
    subject?: Users;
}

export class RelationshipsArgs {
    @IsOptional()
    id?: string;

    @Type(() => Dialogs)
    @IsOptional()
    dialog?: Partial<Dialogs>;

    @Type(() => Users)
    @IsOptional()
    emiter?: Partial<Users>;

    @Type(() => Users)
    @IsOptional()
    subject?: Partial<Users>;
}
