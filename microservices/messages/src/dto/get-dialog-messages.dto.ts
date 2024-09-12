import { Messages } from "src/common";
import { FindManyOptions } from "typeorm";

export interface GetDialogMessagesDTO extends Pick<Messages, "dialog_id" | "has_attachments">, Pick<FindManyOptions<Messages>, "skip" | "take"> {}

export interface GetLastMessageDialogDTO extends Pick<Messages, "dialog_id"> {}