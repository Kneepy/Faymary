import { Body, Controller, Get, Post, Req, Res, Headers } from "@nestjs/common";
import { CreateUserDto, LoginUserDto } from "../dto/users";
import * as bcrypt from "bcryptjs";
import { SessionService, UsersService } from "src/mysql";
import { Users } from "src/entity";
import { AuthService } from "src/auth";
import { ICustomHeaders, ICustomRequest, ICustomResponse } from "src/common/types";
import { Payload } from "src/auth/dto";
import { EXPIRENS_IN_REFRESH_TOKEN } from "src/config";

@Controller("user")
export class UserController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
        private sessionService: SessionService
    ) {}

    @Post("create")
    public async createUser(
        @Body() body: CreateUserDto,
        @Req() req: ICustomRequest,
        @Res({ passthrough: true }) res: ICustomResponse,
    ): Promise<{ user: Users; token: string }> {
        body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(2));

        const user = await this.userService.create(body);
        const accessToken = { userId: user.id };
        const refreshToken = {
            userId: user.id,
            ua: req.session.useragent.source,
            ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        };
        const tokens = await this.authService.getTokens(
            accessToken,
            refreshToken,
        );

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: EXPIRENS_IN_REFRESH_TOKEN,
        });

        return {
            user,
            token: tokens.accessToken,
        };
    }

    @Get("login")
    public async loginUser(
        @Req() req: ICustomRequest,
        @Res({ passthrough: true }) res: ICustomResponse,
    ) {
        try {
            const currentRefreshToken = req.cookie.refreshToken
            const decodedCurrentRefreshToken = this.authService.verifyRefreshToken(currentRefreshToken)

            return await this.userService.findOne({id: decodedCurrentRefreshToken.userId})
        } catch (e) {
            res.redirect(401, "/tokens/refresh")
        }
    }
}
