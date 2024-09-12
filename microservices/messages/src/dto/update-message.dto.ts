import { Messages } from "../common";

export class UpdateMessageDTO implements Omit<Messages, "createdAt"> {
    dialog_id: string;
    msg: string;
    id: string;
    item_id: string;
    user_id: string;
    has_attachments: boolean
}
