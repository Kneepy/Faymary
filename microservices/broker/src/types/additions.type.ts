import { Dialog } from "src/proto/dialogs"
import {Attachment, Message} from "src/proto/messages"
import { Post } from "src/proto/post"
import { Story } from "src/proto/stories"
import { User } from "src/proto/user"
import { File } from "../proto/store";

export enum AdditionsType {
    USER = 0,
    STORY = 1,
    POST = 2,
    COMMENT = 3,
    MESSAGE = 4,
    DIALOG = 5,
    FILE = 7
}

export enum Fields {
    USER = "user",
    COMMENT = "comment",
    DIALOG = "dialog",
    MESSAGE = "message",
    STORY = "story",
    POST = "post",
    FILE = "file",
    LIKE = "like"
}

export interface Addition {
    [Fields.USER]?: User | User[]
    [Fields.POST]?: Post | Post[]
    [Fields.COMMENT]?: Comment | Comment[]
    [Fields.STORY]?: Story | Story[]
    [Fields.MESSAGE]?: Message | Message[]
    [Fields.DIALOG]?: Dialog | Dialog[]
    [Fields.FILE]?: File | File[]
    [key: string]: any | any[]
}