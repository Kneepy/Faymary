export enum UserState {
    UNACTIVE = 0, ACTIVE = 1
}

export interface User {
    id: string
    email: string
    fullName: string
    userName: string
    state: UserState
    file_id: string
    password: string
}