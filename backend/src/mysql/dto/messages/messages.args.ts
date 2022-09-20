import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Dialogs } from "src/entity";

export class MessagesArgs {
    @IsString()
    @IsNotEmpty()
    id: string
}

export class ManyMessagesArgs {
    @Type(() => Dialogs)
    @IsNotEmpty()
    dialog: Dialogs | Dialogs[]
}