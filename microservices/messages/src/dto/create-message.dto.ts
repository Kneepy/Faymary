import { Messages } from "src/common";

export class CreateMessageDTO implements Omit<Messages, "id" | "createdAt"> {
    dialog_id!: string;
    msg: string;
    user_id: string;
    has_attachments: boolean;
}
