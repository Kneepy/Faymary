import { Users } from "src/entity";

export interface AccessToken {
    userId: string;
}

export interface RefreshToken {
    userId: string;
    ua: string; // user-agent
    ip: string;
    fingerprint: string
}

export interface Payload {
    refreshToken: string;
    accessToken: string;
}

export interface AccessPayload {
    token: string 
}