import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { CreateUserDto, LoginUserDto } from "../dto/users";
import * as bcrypt from "bcryptjs";
import { UsersService } from "src/mysql";
import { Users } from "src/entity";
import { AuthService } from "src/auth";
import { ICustomRequest, ICustomResponse } from "src/common/types";
import { EXPIRENS_IN_REFRESH_TOKEN, REFRESH_TOKEN_COOKIE } from "src/config";
import { DisableAuth } from "src/auth";

@Controller("user")
export class UserController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}

    @Post("create")
    @DisableAuth()
    public async createUser(
        @Body() body: CreateUserDto,
        @Req() req: ICustomRequest,
        @Res({ passthrough: true }) res: ICustomResponse
    ): Promise<{ user: Users; token: string }> {
        body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(2));

        const user = await this.userService.create(body);
        const accessToken = { userId: user.id };
        const refreshToken = {
            userId: user.id,
            ua: req.session.useragent,
            ip:
                req.ip ||
                req.headers["x-forwarded-for"] ||
                req.socket.remoteAddress,
            fingerprint: req.headers.fingerprint
        };
        const tokens = await this.authService.getTokens(
            accessToken,
            refreshToken
        );

        res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: EXPIRENS_IN_REFRESH_TOKEN
        });

        return {
            user,
            token: tokens.accessToken
        };
    }

    @Get("login")
    public async loginUser(@Body() body: LoginUserDto) {}
}
