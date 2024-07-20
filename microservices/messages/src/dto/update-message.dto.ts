import { Messages, AttachmentType, Attachments } from "../common";

export class UpdateMessageDTO implements Omit<Messages, "createdAt"> {
    dialog_id: string;
    msg: string;
    attachments: Attachments[];
    id: string;
    item_id: string;
    user_id: string;
}
