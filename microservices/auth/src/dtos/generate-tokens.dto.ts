import { CreateSession } from "src/interfaces";

export interface SessionOptions {
    fingerprint: string;
    ua: string;
    ip: string;
}

export class GenerateTokensDTO implements CreateSession {
    fingerprint: string;
    ua: string;
    ip: string;
    user_id: string;
}

export class GenerateTokensBySessionDTO {
    access_token: string
    refresh_token: string
    session: SessionOptions
}