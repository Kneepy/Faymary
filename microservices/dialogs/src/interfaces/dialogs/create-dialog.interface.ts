import { ModifiedDialog } from "src/common";

export interface CreateDialogInterface extends Pick<ModifiedDialog, "creators_ids" | "user_ids"> {}