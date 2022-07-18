import type useragent from "express-useragent";
import { Users } from "src/entity";

export interface AccessToken {
    userId: string;
}

export interface RefreshToken {
    userId: string;
    ua: useragent.Details["source"]; // user-agent
    ip: string;
}

export interface Payload {
    refreshToken: string;
    accessToken: string;
}

export interface AccessPayload {
    token: string 
}