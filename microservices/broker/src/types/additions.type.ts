import { Dialog } from "src/proto/dialogs"
import { Message } from "src/proto/messages";
import { Post } from "src/proto/post"
import { Story } from "src/proto/stories"
import { User } from "src/proto/user"
import { File } from "../proto/store";
import { Like } from "../proto/likes";

export enum Fields {
    USERS = "users",
    COMMENTS = "comments",
    DIALOGS = "dialogs",
    MESSAGES = "messages",
    STORIES = "stories",
    POSTS = "posts",
    FILES = "files",
    LIKES = "likes"
}

export interface Addition {
    [Fields.USERS]?: User[]
    [Fields.POSTS]?: Post[]
    [Fields.COMMENTS]?: Comment[]
    [Fields.STORIES]?: Story[]
    [Fields.MESSAGES]?: Message[]
    [Fields.DIALOGS]?: Dialog[]
    [Fields.FILES]?: File[]
    [Fields.LIKES]?: Like[]
}