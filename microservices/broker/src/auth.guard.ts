import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { SESSION_MODULE_CONFIG, USE_AUTH_METADATA } from "./app.constants";
import { SessionServiceClient } from "./proto/session";
import { ICustomRequest } from './types/request.type';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: ICustomRequest = context.switchToHttp().getRequest();
        
        if(this.reflector.get<boolean>(USE_AUTH_METADATA, context.getHandler()) == false) return true
        else {
            const accessToken = request.headers.authorization
            const refreshToken = request.cookies.refresh_token ?? request.headers.refresh_token

            if(!refreshToken) throw new UnauthorizedException
            else {
                const ip = request.ip || request.socket.remoteAddress || request.headers['x-forwarded-for']
                const sessionOptions = {ua: request.headers["user-agent"], fingerprint: request.headers["fingerprint"], ip}
                const tokens = await this.sessionService.generateTokensBySession({access_token: accessToken, refresh_token: refreshToken, session: sessionOptions}).toPromise()
                const verifedTokens = await this.sessionService.verifyTokens(tokens).toPromise()

                if(verifedTokens.user_id !== null) {
                    request.user_id = verifedTokens.user_id
                }

                return true
            }
        }        
    }
}