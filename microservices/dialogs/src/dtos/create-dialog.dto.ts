import { DialogParticipants, Dialogs } from "src/common"

export class CreateDialogDTO implements Pick<Dialogs, "participants" | "name"> {
    name: string

    // всегда должен быть пользователь у которого будут права создателя или админа
    participants: DialogParticipants[]
    
}