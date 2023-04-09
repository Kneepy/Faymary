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

export interface Account extends User {
    id: string
    user_id: string
}

export interface UserId {
    user_id: string
}

export interface AuthTokens {
    access_token: string
    refresh_token: string
}