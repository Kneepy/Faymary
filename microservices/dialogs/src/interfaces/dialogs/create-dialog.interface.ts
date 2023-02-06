import { Dialogs } from "src/common";

export interface CreateDialogInterface extends Pick<Dialogs, "creator_id" | "user_ids"> {}