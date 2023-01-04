import { Messages, MessagesEnumType } from "../common";

export class UpdateMessageDTO implements Omit<Messages, "createdAt"> {
    attachment: MessagesEnumType;
    dialog_id: string;
    id: string;
    message: string;
    item_id: string;
    user_id: string;
}
