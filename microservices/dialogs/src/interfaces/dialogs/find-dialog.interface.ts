import { Dialogs } from "src/common";

export interface FindOneDialogInterface extends Pick<Dialogs, "id"> {}

export interface FindDialogInterface {
    user_id: string
}