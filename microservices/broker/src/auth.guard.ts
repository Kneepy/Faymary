import {
    AUTH_COOKIE_OPTIONS,
    COOKIE_REFRESH_TOKEN_NAME,
    REQUEST_FIELD_ACCESS_TOKEN,
    REQUEST_FIELD_REFRESH_TOKEN
} from "src/constants/app.constants";
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { SESSION_MODULE_CONFIG, USE_AUTH_METADATA } from "./constants/app.constants";
import { SessionServiceClient } from "./proto/session";
import { UnauthorizedError } from './constants/errors.constants';
import { ICustomResponse, ICustomRequest } from './types';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request: ICustomRequest = context.switchToHttp().getRequest();
            const response: ICustomResponse = context.switchToHttp().getResponse()

            // типо защита от лоха
            delete request.user_id

            if(this.reflector.get<boolean>(USE_AUTH_METADATA, context.getHandler()) == false) return true
            
            const accessToken = request.headers[REQUEST_FIELD_ACCESS_TOKEN]
            const refreshToken = request.cookies.refresh_token ?? request.headers.refresh_token

            if(!refreshToken) throw UnauthorizedError

            const tokens = await this.sessionService.generateTokensBySession({
                access_token: accessToken,
                refresh_token: refreshToken,
                session: {
                    ua: request.headers["user-agent"],
                    fingerprint: request.headers["fingerprint"],
                    ip: request.ip || request.socket.remoteAddress || request.headers["x-forwarded-for"]
                }
            }).toPromise()
            const verifiedTokens = await this.sessionService.verifyTokens(tokens).toPromise()

            request.headers.refresh_token = tokens.refresh_token
            request.headers.authorization = tokens.access_token
            response.header(REQUEST_FIELD_REFRESH_TOKEN, tokens.refresh_token)
            response.header(REQUEST_FIELD_ACCESS_TOKEN, tokens.access_token)
            response.cookie(COOKIE_REFRESH_TOKEN_NAME, request.headers.refresh_token, AUTH_COOKIE_OPTIONS)

            if(!!verifiedTokens.user_id) {
                request.user_id = verifiedTokens.user_id
            }

            return true
        } catch (e) {
            throw new UnauthorizedException(e.message)
        }
    }
}