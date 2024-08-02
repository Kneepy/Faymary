import { ParticipantRights } from "../common";

export interface GetParticipantsDialogDTO {
    dialog_id: string
    rights?: ParticipantRights[]
    take?: number
    skip?: number
}