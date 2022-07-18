import { ICustomRequest, ICustomHeaders, ICustomResponse } from 'src/common/types';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

@Injectable()
export class VerifyTokensGuards extends CanActivate {
    construector(
        private authService: AuthService,
        private sessionService: SessionService
    ) {}

    async canActivate(context: ExecutionContext) {
        const http = context.switchToHttp()
        const res: ICustomResponse = http.getResponse()
        const req: ICustomRequest = http.getRequest()
        const headers: ICustomHeaders = req.headers

        if(this.authService.verifyAccessToken(headers.authorization) && this.authService.verifyRefreshToken(req.cookie.refreshToken)) {
            return {
                token: headers.authorization
            }
        }
        else {
            const user = await (await this.sessionService.findOne({id: req.cookie.refreshToken}, {relations: ["user"]})).user
            const accessToken = { userId: user.id };
            const refreshToken = {
                userId: user.id,
                ua: req.session.useragent.source,
                ip: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
            };
            const cookieOptions = {
                httpOnly: true,
                secure: true,
            };
            const tokens = await this.authService.getTokens(
                accessToken,
                refreshToken,
            );

            res.cookie("refreshToken", tokens.refreshToken, {...cookieOptions, maxAge: EXPIRENS_IN_REFRESH_TOKEN});

            return {token: tokens.accessToken}
        }
    }
}