import { Dialogs } from "src/common";

export interface CreateDialogInterface extends Omit<Dialogs, "id" | "history"> {}