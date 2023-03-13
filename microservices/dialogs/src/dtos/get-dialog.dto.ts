import { Dialogs } from "src/common"

export class GetDialogDTO implements Pick<Dialogs, "id"> {
    id: string
    
}

export class GetUserDialogsDTO {
    user_id: string
    take: number
    skip: number
}