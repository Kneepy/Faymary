import { Comment as BaseComment } from "src/proto/comments";
import {
    DialogHistory as BaseDialogHistory,
    Dialog as BaseDialog,
    DialogParticipants as BaseDialogParticipants,
} from "src/proto/dialogs";
import { Notification as BaseNotification } from "src/proto/notification";
import { Message as BaseMessage } from "src/proto/messages";
import { Post as BasePost } from "src/proto/post"
import { Account, Profile as BaseProfile } from "src/proto/profiles";
import { Story as BaseStory, Mark } from "src/proto/stories";
import { Addition } from "./additions.type";
import { User } from "src/proto/user";
import { HasLiked, LikesCollection } from "../proto/likes";

export namespace BrokerResponse {
    export interface DialogHistory extends BaseDialogHistory {
        attachments?: Addition
    }
    export interface Dialog extends Omit<BaseDialog, "participants"> {
        lastMessage?: Message
        participants: Omit<DialogParticipant, "dialog" | "user_id">[]
    }
    export interface ResultSearchDialog {
        existing: User[]
        nonexistent: User[]
    }
    export interface DialogParticipant extends BaseDialogParticipants {
        user: User
    }
    export interface Message extends Omit<BaseMessage, "attachments"> {
        attachments: Addition
        user: User
    }
    export interface AddLikeResult {
        message: Omit<Message, "user" | "attachments">
        like: LikesCollection
    }
    export interface Notification extends BaseNotification {
        parent: Addition
        item: Addition
        from: User
        to: User
    }
    export interface Comment extends BaseComment {
        attachments: Addition
        user: User
    }
    export interface Post extends BasePost {
        user: User
    }
    export interface Profile extends BaseProfile {
        accounts: (Account & {user: User})[]
    }

    /**
     * Все типы связанные с историями
     */
    export interface StoryMark extends Mark {
        attachment: Addition
    }
    export interface Story extends BaseStory {
        attachments: Addition
    }
    export interface UserStories {
        user: User
        /**
         * Т.к когда мы отдаём все истории выложенные одинм пользователем нам не нужно получать их вложения т.к они не должны отображатся сразу клиенту
         * Поэтому тип BaseStory[]
         */
        stories: BaseStory[]
    }
}
