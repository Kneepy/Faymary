import { Messages, AttachmentType, Attachments } from "src/common";

export class CreateMessageDTO implements Omit<Messages, "id" | "createdAt"> {
    attachments: Attachments[];
    dialog_id!: string;
    item_id: string;
    msg: string;
    user_id: string;
}
