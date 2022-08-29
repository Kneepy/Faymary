import {
    ICustomRequest,
    ICustomHeaders,
    ICustomResponse
} from "src/common/types";
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException
} from "@nestjs/common";
import { USE_AUTH_METADATA } from "src/auth";
import { SessionService } from "src/mysql/providers/session.service";
import { AuthService } from "../auth.service";
import { EXPIRENS_IN_REFRESH_TOKEN, REFRESH_TOKEN_COOKIE } from "src/config";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private sessionService: SessionService,
        private authService: AuthService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext) {
        const http = context.switchToHttp();
        const res: ICustomResponse = http.getResponse();
        const req: ICustomRequest = http.getRequest();
        const headers: ICustomHeaders = req.headers;

        try {
            if (!req.cookie?.refreshToken) {
                if (
                    !this.reflector.get(USE_AUTH_METADATA, context.getHandler())
                ) {
                    return true;
                } else {
                    throw new UnauthorizedException();
                }
            }

            this.authService.verifyAccessToken(headers.authorization) &&
                this.authService.verifyRefreshToken(req.cookie.refreshToken);

            return true;
        } catch (e) {
            if (!req.cookie.refreshToken) {
                throw new UnauthorizedException();
            }

            const session = await this.sessionService.findOne(
                { id: req.cookie.refreshToken },
                { relations: ["user"] }
            );
            const deleteOutdatedSession = await this.sessionService.delete(
                session.id
            );

            const fingerprint = req.headers.fingerprint;
            const ip =
                req.ip ||
                req.headers["x-forwarded-for"] ||
                req.socket.remoteAddress;

            if (session.fingerprint !== fingerprint || session.ip !== ip) {
                throw new UnauthorizedException();
            }

            const accessToken = { userId: session.user.id };
            const refreshSession = {
                userId: session.user.id,
                ua: req.session.useragent,
                ip,
                fingerprint
            };
            const tokens = await this.authService.getTokens(
                accessToken,
                refreshSession
            );

            res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: EXPIRENS_IN_REFRESH_TOKEN
            });
            headers.authorization = tokens.accessToken;

            return true;
        }
    }
}
