import type useragent from "express-useragent";
import { Users } from "src/entity";

export interface AccessToken {
    userId: string;
}

export interface RefreshToken {
    user: Users;
    ua: useragent.Details["source"]; // user-agent
    ip: string;
}

export interface Payload {
    refreshToken: string;
    accessToken: string;
}
