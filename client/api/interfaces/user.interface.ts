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
    profile: Profile
}
// эта тема так выглядит на беке чтобы отправлять данные между микросервисами
export interface Users {
    users: User[]
}

export interface Profile {
    commentsNotification: boolean
    deleteDialogNotifications: boolean
    exceptionsFromDialogsNotifications: boolean
    id: string
    likesNotification: boolean
    subscriptionNotifications: boolean
    user_id: string
    accounts: Account[]
}

export interface Account {
    id: string
    user_id: string
    user: User
}

export interface UserId {
    user_id: string
}

export interface AuthTokens {
    access_token: string
    refresh_token: string
}