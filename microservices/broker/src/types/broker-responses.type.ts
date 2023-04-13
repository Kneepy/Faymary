import { Comment as BaseComment } from "src/proto/comments";
import { DialogHistory as BaseDialogHistory } from "src/proto/dialogs";
import { Notification as BaseNotification } from "src/proto/notification";
import { Message as BaseMessage } from "src/proto/messages";
import { Post as BasePost } from "src/proto/post"
import { Account, Profile as BaseProfile } from "src/proto/profiles";
import { Addition } from "./additions.type";
import { User } from "src/proto/user";

export namespace BrokerResponse {
    export interface Comment extends BaseComment {
        attachments: Addition
        user: User
    }
    export interface DialogHistory extends BaseDialogHistory {
        attachments?: Addition
    }
    export interface Message extends BaseMessage {
        attachments: Addition
        user: User
    }
    export interface Notification extends BaseNotification {
        parent: Addition
        item: Addition
        from: User
        to: User
    }
    export interface Post extends BasePost {
        user: User
    }
    export interface Profile extends BaseProfile {
        accounts: (Account & {user: User})[]
    }
}