import e from "express";
import { DialogParticipants, Dialogs } from "src/common";

export namespace DialogsInterfaces {
    export interface CreateDialog extends Pick<Dialogs, "participants" | "name"> {}
    export interface FindOneDialog extends Pick<Dialogs, "id"> {}
    export interface FindManyDialogsByUserId extends Pick<DialogParticipants, "user_id">, Partial<Pick<Dialogs, "state">> {}
    export interface FindManyDialogs extends Omit<Dialogs, "id"> {}

    export interface PindOneParticipantDialog extends Pick<DialogParticipants, "user_id"> {
        dialog_id: string
    }
}