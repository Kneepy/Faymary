import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Dialogs, Files, HistoryActions, Users } from "src/entity";
import { HistoryActionsDialogType } from "src/mysql/enums";

export class RelationshipsInput implements Partial<Omit<HistoryActions, "id" | "createdAt"> >{
    @Type(() => Files)
    @IsOptional()
    file?: Files;

    @IsOptional()
    payload?: string;

    @Type(() => Dialogs)
    @IsNotEmpty()
    dialog: Dialogs;

    @Type(() => Users)
    @IsNotEmpty()
    emiter: Users;

    @Type(() => Users)
    subject?: Users;

    @IsNotEmpty()
    type: HistoryActionsDialogType
}
