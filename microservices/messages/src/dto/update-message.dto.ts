import { Messages, MessagesEnumType } from "../common";

export class UpdateMessageDTO implements Omit<Messages, "createdAt"> {
    msg: string;
    attachment: MessagesEnumType;
    dialog_id: string;
    id: string;
    item_id: string;
    user_id: string;
}
