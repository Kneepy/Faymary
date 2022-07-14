export interface AccessToken {
    userId: string
}

export interface RefreshToken {
    userId: string
    deviceIP: string
}

export interface Payload {
    refreshToken: string
    accessToken: string
}