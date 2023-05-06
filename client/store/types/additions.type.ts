import { Dialog } from "./dialog.type";
import { Message } from "./message.type";
import { Post } from "./post.type";
import { Story } from "./story.type";
import { User } from "./user.type";

export enum AdditionsType {
    USER = 0,
    STORY = 1,
    POST = 2,
    COMMENT = 3,
    MESSAGE = 4,
    DIALOG = 5,
    LIKE = 6,
}

export interface Addition {
    user?: User
    post?: Post
    comment?: Comment
    story?: Story
    message?: Message
    dialog?: Dialog
}