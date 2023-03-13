import { ModifiedDialog } from "src/common"

export class CreateDialogDTO implements Pick<ModifiedDialog, "creators_ids" | "user_ids"> {
    creators_ids: string[]
    user_ids: string[]
}