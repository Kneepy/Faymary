import { Request } from 'express';

export interface ICustomRequest extends Request {
    headers: {
        fingerprint: string
    }
}