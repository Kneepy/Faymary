import type { Dialog, Post, Story, User, Message, File, LikesCollection } from "~/api";

export interface Addition {
    users?: User[]
    posts?: Post[]
    comments?: Comment[]
    stories?: Story[]
    messages?: Message[]
    dialogs?: Dialog[]
    files?: File[]
    likes?: LikesCollection[]
}