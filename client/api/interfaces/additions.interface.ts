import type { Dialog, Post, Story, User, Message } from "~/api";

export enum AdditionsType {
    USER = 0,
    STORY = 1,
    POST = 2,
    COMMENT = 3,
    MESSAGE = 4,
    DIALOG = 5,
    LIKE = 6,
    FILE= 7
}

export interface Addition {
    user?: User
    post?: Post
    comment?: Comment
    story?: Story
    message?: Message
    dialog?: Dialog
}