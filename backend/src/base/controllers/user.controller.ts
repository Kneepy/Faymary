import { BadRequestException, Body, Controller, Get, GoneException, Inject, NotFoundException, Patch, Post, Query, Req, Res, UnauthorizedException } from "@nestjs/common";
import { AddUserAccountDto, CreateUserDto, LoginUserDto } from "../dto/users";
import * as bcrypt from "bcryptjs";
import { UsersService } from "src/mysql/providers/users.service";
import { AuthService, DisableAuth } from "src/auth";
import { ICustomRequest, ICustomResponse } from "src/common/types";
import { INVALID_PASSWORD, USER_ALREADY_EXIST_EMAIL_ERROR, USER_NOT_FOUND_EMAIL, UtilService, WAITING_TIME_EXPIRED_CONFIRM } from "src/common";
import { MailerService } from "@lib/mailer";
import { PayloadAuthUser } from "../interfaces";
import { EXPIRENS_IN_REFRESH_TOKEN, REFRESH_TOKEN_COOKIE } from "src/config";
import { ConfirmationsService } from "src/mysql";
import { Users } from "src/entity";

@Controller("user")
export class UserController {
    constructor(
        private userService: UsersService,
        private confirmationService: ConfirmationsService,
        private mailerService: MailerService,
        private authService: AuthService,
    ) {}

    @Post("/create")
    @DisableAuth()
    public async createUser(
        @Body() body: CreateUserDto
    ): Promise<string> {
        const existUser = await this.userService.findOne({email: body.email})

        if(!!existUser) {
            throw new BadRequestException(USER_ALREADY_EXIST_EMAIL_ERROR)
        }

        body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(2));
        
        const lastName = body.email.split("@")[0]
        const user = await this.userService.create({...body, lastName});
        
        return await this.setConfirmation(user)
    }

    @Post("/login")
    @DisableAuth()
    public async loginUser(
        @Body() body: LoginUserDto
    ): Promise<string> {
        const user = await this.userService.findOne({email: body.email})

        if(!!user) {
            if(bcrypt.compareSync(body.password, user.password)) {
                return await this.setConfirmation(user)
            }
            else {
                throw new UnauthorizedException(INVALID_PASSWORD)
            }
        }
        else {
            throw new NotFoundException(USER_NOT_FOUND_EMAIL)
        }
    }

    @Get("/confirmation")
    @DisableAuth()
    public async getUserByConfirmation(
        @Query("confirmation") confirmationId: string,
        @Query("code") confirmationCode: string,
        @Req() req: ICustomRequest,
        @Res({ passthrough: true }) res: ICustomResponse
    ): Promise<PayloadAuthUser> {
        const confirmation = await this.confirmationService.findOne({id: confirmationId}, {relations: ["user"]})

        if(confirmation.code === confirmationCode && confirmation.expirensIn <= Date.now()) {
            return await this.setUser({req, res}, confirmation.user)
        }
        else {
            throw new GoneException(WAITING_TIME_EXPIRED_CONFIRM)
        }
    }

    @Patch("/add-account")
    public async addAccount(
        @Req() req: ICustomRequest,
        @Res() res: ICustomResponse,
        @Body() body: AddUserAccountDto
    ) {}

    @Get("/test")
    wd() {
        this.mailerService.send({
            from: "Faymary <ilyafamin4@gmail.com>",
            to: "ilyafamin4@gmail.com",
            subject: "Account Confirmation",
            text: "code",
        })
    }

    private async setConfirmation(user: Users): Promise<string> {
        const code = `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
        const confirm = await this.confirmationService.create({code, user})

        this.mailerService.send({
            from: "Faymary <ilyafamin4@gmail.com>",
            to: user.email,
            subject: "Account Confirmation",
            text: code,
        })

        return confirm.id
    }

    private async setUser({req, res}: {req: ICustomRequest, res: ICustomResponse}, user): Promise<PayloadAuthUser> {
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
}
