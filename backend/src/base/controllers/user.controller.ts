<<<<<<< HEAD
import { Body, ConsoleLogger, Controller, Get, Post, Req, Res, UsePipes } from "@nestjs/common";
=======
import { BadRequestException, Body, Controller, Get, Inject, NotFoundException, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
>>>>>>> hotfix
import { CreateUserDto, LoginUserDto } from "../dto/users";
import * as bcrypt from "bcryptjs";
import { UsersService } from "src/mysql/providers/users.service";
import { AuthService, DisableAuth } from "src/auth";
import { ICustomRequest, ICustomResponse } from "src/common/types";
import { INVALID_PASSWORD, USER_ALREADY_EXIST_EMAIL_ERROR, USER_NOT_FOUND_EMAIL, UtilService } from "src/common";
import { MailerService } from "@lib/mailer";
import { PayloadAuthUser } from "../interfaces";
import { EXPIRENS_IN_REFRESH_TOKEN, REFRESH_TOKEN_COOKIE } from "src/config";

@Controller("user")
export class UserController {
    constructor(
        private userService: UsersService,
<<<<<<< HEAD
=======
        private mailerService: MailerService,
>>>>>>> hotfix
        private authService: AuthService
    ) {}

    @Post("/create")
    @DisableAuth()
    public async createUser(
        @Body() body: CreateUserDto,
        @Req() req: ICustomRequest,
        @Res({ passthrough: true }) res: ICustomResponse
    ): Promise<PayloadAuthUser> {
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

<<<<<<< HEAD
    @Get("login")
    //@UsePipes(new ValPipe())
    public async loginUser(
        @Body() log: LoginUserDto
    ) {
        //console.log(req.body)
=======
    @Post("/login")
    @DisableAuth()
    public async loginUser(
        @Body() body: LoginUserDto,
        @Req() req: ICustomRequest,
        @Res({ passthrough: true }) res: ICustomResponse
    ): Promise<PayloadAuthUser> {
        const user = await this.userService.findOne({email: body.email})

        if(!!user) {
            if(bcrypt.compareSync(body.password, user.password)) {
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
            else {
                throw new UnauthorizedException(INVALID_PASSWORD)
            }
        }
        else {
            throw new NotFoundException(USER_NOT_FOUND_EMAIL)
        }
>>>>>>> hotfix
    }
}
