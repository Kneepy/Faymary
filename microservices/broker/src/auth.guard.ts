import { COOKIE_REFRESH_TOKEN_NAME } from 'src/constants/app.constants';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { SESSION_MODULE_CONFIG, USE_AUTH_METADATA } from "./constants/app.constants";
import { SessionServiceClient } from "./proto/session";
import { ICustomRequest } from './types/request.type';
import { UnautorizedError } from './constants/errors.constants';
import { ICustomResponse } from './types/response.type';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: ICustomRequest = context.switchToHttp().getRequest();
        const response: ICustomResponse = context.switchToHttp().getResponse()

        // типо защита от лоха
        delete request.user_id

        if(this.reflector.get<boolean>(USE_AUTH_METADATA, context.getHandler()) == false) return true
        
        const accessToken = request.headers.authorization
        const refreshToken = request.cookies.refresh_token ?? request.headers.refresh_token

        if(!refreshToken) throw UnautorizedError
        
        const ip = request.ip || request.socket.remoteAddress || request.headers['x-forwarded-for']
        const sessionOptions = {ua: request.headers["user-agent"], fingerprint: request.headers["fingerprint"], ip}
        const tokens = await this.sessionService.generateTokensBySession({access_token: accessToken, refresh_token: refreshToken, session: sessionOptions}).toPromise()
        const verifedTokens = await this.sessionService.verifyTokens(tokens).toPromise()

        request.headers.refresh_token = tokens.refresh_token
        request.headers.authorization = tokens.access_token

        response.setCookie(COOKIE_REFRESH_TOKEN_NAME, request.headers.refresh_token)

        if(verifedTokens.user_id !== null) {
            request.user_id = verifedTokens.user_id
        }

        return true

    }
}