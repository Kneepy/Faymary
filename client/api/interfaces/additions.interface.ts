import { Dialog } from "./dialog.interface"
import { Message } from "./message.interface"
import { Post } from "./post.interface"
import { Story } from "./stories.interface"
import { User } from "./user.interface"

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