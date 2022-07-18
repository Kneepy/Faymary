import { Controller, Get, Headers, Ip, Req, Res } from "@nestjs/common";
import { ICustomHeaders, ICustomRequest, ICustomResponse } from "src/common";
import { EXPIRENS_IN_REFRESH_TOKEN } from "src/config";
import { SessionService } from "src/mysql";
import { AuthService } from "./auth.service";
import { AccessPayload } from "./dto";

@Controller("tokens")
export class AuthController {

    constructor(
        private authService: AuthService,
        private sessionService: SessionService
    ) {}

    @Get("refresh")
    public async refreshTokens(
        @Req() req: ICustomRequest,
        @Res({ passthrough: true }) res: ICustomResponse,
        @Headers() headers: ICustomHeaders
    ): Promise<AccessPayload> {        
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