import { Messages, MessagesEnumType } from "src/common";

export class CreateMessageDTO implements Omit<Messages, "id" | "createdAt"> {
    attachment: MessagesEnumType;
    dialog_id!: string;
    item_id: string;
    message: string;
    user_id: string;
}
