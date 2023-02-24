export class GetDialogDTO {
    dialog_id: string
}

export class GetUserDialogsDTO {
    user_id: string
    take: number
    skip: number
}