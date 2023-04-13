export enum DialogActionEnum {
    CREATE_DIALOG = 0,
    DELETE_DIALOG = 1,
    ADD_USER = 2,
    REMOVE_USER = 3,
    CHANGE_NAME_DIALOG = 4,
    CHANGE_FILE_DIALOG = 5,
}
export enum StateDialogEnum {
    DELETED = 0,
    ACTIVE = 1,
}
export enum ParticipantRights {
    LISTENER = 0,
    USER = 1,
    ADMIN = 2,
    CREATOR = 3,
}
export interface DialogParticipants {
    id: string;
    rights: ParticipantRights;
    user_id: string;
    dialog: Dialog;
}
export interface Dialog {
    id: string;
    participants: DialogParticipants[];
    state: StateDialogEnum;
    name: string;
    file_id: string;
} 
export interface DialogHistory {
    id: string;
    user_id: string;
    action: DialogActionEnum;
    item_id?: string;
    desc?: string;
    createdAt: string;
    dialog: Dialog;
}