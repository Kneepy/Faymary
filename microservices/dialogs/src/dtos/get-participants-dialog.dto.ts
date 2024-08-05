import { ParticipantRights } from "../common";

export interface GetParticipantsDialogDTO {
    dialog_id: string
    rights?: ParticipantRights[]
    take?: number
    skip?: number
}

export interface GetAllParticipantsDialogDTO {
    dialog_id: string
}

export interface GetAllInterlocutorsUserDTO {
    user_id: string
}