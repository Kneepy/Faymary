import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Dialogs } from "src/entity";
import { FindOperator } from "typeorm";

export class MessagesArgs {
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class ManyMessagesArgs {
    @Type(() => Dialogs)
    @IsOptional()
    dialog?: Dialogs | Dialogs[];

    @IsOptional()
    id?: FindOperator<any> | string; // In typeorm func
}
