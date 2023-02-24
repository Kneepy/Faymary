import { CreateSession } from "src/interfaces";

export class GenerateTokensDTO implements CreateSession {
    fingerprint: string;
    ua: string;
    ip: string;
    user_id: string;
    old_refresh_token: string
}