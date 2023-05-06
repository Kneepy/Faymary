import { Messages } from "src/common";
import { FindManyOptions } from "typeorm";

export class GetDialogMessagesDTO
    implements
        Pick<Messages, "dialog_id">,
        Pick<FindManyOptions<Messages>, "skip" | "take">
{
    dialog_id: string;
    take: number;
    skip: number;
}
