import { Messages, MessagesEnumType } from "../common";

export class UpdateMessageDTO implements Omit<Messages, "createdAt"> {
    dialog_id: string;
    msg: string;
    attachment: MessagesEnumType;
    id: string;
    item_id: string;
    user_id: string;
}
