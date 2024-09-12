import { FastifyRequest } from 'fastify';

export interface ICustomRequest extends FastifyRequest {
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