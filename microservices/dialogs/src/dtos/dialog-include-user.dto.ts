import { DialogParticipants } from "src/common";

export class DialogIncludeUserDTO implements Pick<DialogParticipants, "user_id"> {
    user_id: string;
    dialog_id: string;
}