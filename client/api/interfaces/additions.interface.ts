import type { Dialog, Post, Story, User, Message, File } from "~/api";

export interface Addition {
    users?: User[]
    posts?: Post[]
    comments?: Comment[]
    stories?: Story[]
    messages?: Message[]
    dialogs?: Dialog[]
    files?: File[]
}