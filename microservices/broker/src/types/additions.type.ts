import { Dialog } from "src/proto/dialogs"
import { Message } from "src/proto/messages"
import { Post } from "src/proto/post"
import { Story } from "src/proto/stories"
import { User } from "src/proto/user"

export enum AdditionsType {
    USER = 0,
    STORY = 1,
    POST = 2,
    COMMENT = 3,
    MESSAGE = 4,
    DIALOG = 5,
    LIKE = 6,
}

export enum Fields {
    USER = "user",
    COMMENT = "comment",
    DIALOG = "dialog",
    MESSAGE = "message",
    STORY = "story",
    POST = "post"
}

export interface Addition {
    [Fields.USER]?: User
    [Fields.POST]?: Post
    [Fields.COMMENT]?: Comment
    [Fields.STORY]?: Story
    [Fields.MESSAGE]?: Message
    [Fields.DIALOG]?: Dialog
    [key: string]: any
}