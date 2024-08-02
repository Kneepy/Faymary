import e from "express";
import { DialogParticipants, Dialogs, ParticipantRights } from "src/common";

export namespace DialogsInterfaces {
    export interface CreateDialog extends Pick<Dialogs, "participants" | "name"> {}
    export interface FindOneDialog extends Pick<Dialogs, "id"> {}
    export interface FindManyDialogsByUserId extends Pick<DialogParticipants, "user_id">, Partial<Pick<Dialogs, "state">> {}
    export interface FindManyDialogs extends Omit<Dialogs, "id"> {}

    export interface FindOneParticipantDialog extends Pick<DialogParticipants, "user_id"> {
        dialog_id: string
    }
    export interface FindParticipantsDialog {
        dialog_id: string
        rights: ParticipantRights[]
    }
}