import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto, LoginUserDto } from "../dto/users";
import * as bcrypt from "bcryptjs";
import { UsersService } from "src/mysql";
import { Users } from "src/entity";
import { AuthService } from "src/auth";
import { ICustomRequest, ICustomResponse } from "src/common/types";
import { EXPIRENS_IN_REFRESH_TOKEN, REFRESH_TOKEN_COOKIE } from "src/config";
import { DisableAuth } from "src/auth";
import { INVALID_PASSWORD, USER_ALREADY_EXIST_EMAIL_ERROR, USER_NOT_FOUND_EMAIL } from "src/common";
import { MailerService } from "@lib/mailer";

@Controller("user")
export class UserController {
    constructor(
        private userService: UsersService,
        private authService: AuthService, 
        private mailerService: MailerService
    ) {}

    @Post("/create")
    @DisableAuth()
    public async createUser(
        @Body() body: CreateUserDto,
        @Req() req: ICustomRequest,
        @Res({ passthrough: true }) res: ICustomResponse
    ): Promise<{ user: Users; token: string }> {
        const existUser = await this.userService.findOne({email: body.email})

        if(!!existUser) {
            throw new BadRequestException(USER_ALREADY_EXIST_EMAIL_ERROR)
        }

        body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(2));
        
        const lastName = body.email.split("@")[0]
        const user = await this.userService.create({...body, lastName});
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
        req.headers.authorization = tokens.accessToken

        return {
            user,
            token: tokens.accessToken
        };
    }

    @Post("/login")
    @DisableAuth()
    public async loginUser(@Body() body: LoginUserDto) {
        const user = await this.userService.findOne({email: body.email})

        if(!!user) {
            if(bcrypt.compareSync(body.password, user.password)) {
                return user
            }
            else {
                throw new UnauthorizedException(INVALID_PASSWORD)
            }
        }
        else {
            throw new NotFoundException(USER_NOT_FOUND_EMAIL)
        }
    }
}
