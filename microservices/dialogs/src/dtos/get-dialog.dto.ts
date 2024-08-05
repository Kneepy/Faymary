import { DialogParticipants, Dialogs } from "src/common";

export class GetDialogDTO implements Pick<Dialogs, "id"> {
    id: string
}

export class GetUserDialogsDTO {
    user_id: string
    take: number
    skip: number
}

export class SearchUserDialogsDTO implements Partial<Pick<Dialogs, "participants" | "number_participants" | "name">> {
    user_id: string
    participants?: DialogParticipants[]
    number_participants?: number
    name?: string
    take?: number
    skip?: number
}