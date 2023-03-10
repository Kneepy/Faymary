import { Request } from 'express';


export interface ICustomRequest extends Request {
    headers: {
        fingerprint: string
        authorization: string
        refresh_token: string
    }
    cookies: {
        refresh_token: string
    }

    // получается в Auth Guard
    user_id: string
}