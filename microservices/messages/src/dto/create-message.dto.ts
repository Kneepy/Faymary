import { Messages } from "src/common";

export class CreateMessageDTO implements Omit<Messages, "id" | "createdAt" | "has_attachments"> {
    dialog_id!: string;
    item_id: string;
    msg: string;
    user_id: string;
}
