import {
    Body,
    Controller, ForbiddenException,
    Get,
    Inject,
    Post,
    Put,
    Query,
    Req,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import {COOKIE_REFRESH_TOKEN_NAME, MAIL_MODULE_CONFIG, SESSION_MODULE_CONFIG, USER_MODULE_CONFIG} from "src/app.constants";
import { SessionServiceClient, VerifyTokensDTO } from "src/proto/session";
import {Response} from "express"
import {CreateUserDTO, LoginUserDTO, UserServiceClient, UserState} from "src/proto/user";
import { ICustomRequest } from "src/types/request.type";
import {MailServiceClient} from "../proto/mail";
import { DisableAuth } from "src/disable-auth.decorator";

@Controller("/user")
export class UserController {
    constructor(
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        @Inject(MAIL_MODULE_CONFIG.PROVIDER) private mailService: MailServiceClient,
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient
    ) {}

    @Put("/login")
    @DisableAuth()
    async loginUser(@Body() data: LoginUserDTO, @Req() req: ICustomRequest, @Res({ passthrough: true }) res: Response) {
        const isLogined = await this.userService.loginUser({email: data.email, password: data.password}).toPromise()
        if(isLogined.isLogined) {
            const ip = req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for']
            const tokens = await this.sessionService.generateTokens({ua: req.headers["user-agent"], fingerprint: req.headers["fingerprint"], user_id: isLogined.user.id, ip}).toPromise()

            res.cookie(COOKIE_REFRESH_TOKEN_NAME, tokens.refresh_token)

            return tokens
        } else throw UnauthorizedException
    }

    @Put()
    @DisableAuth()
    async confirmUser(@Req() req: ICustomRequest, @Res({ passthrough: true }) res: Response, @Query() data): Promise<VerifyTokensDTO> {
        const { isConfirmed } = await this.mailService.confirmAccessCode({user_id: data.user_id, code: data.code}).toPromise()
        const ip = req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for']
        if(isConfirmed) {
            await this.userService.updateUser({id: data.user_id, state: UserState.ACTIVE}).toPromise()

            const tokens = await this.sessionService.generateTokens({ua: req.headers["user-agent"], fingerprint: req.headers["fingerprint"], user_id: data.user_id, ip}).toPromise()

            res.cookie(COOKIE_REFRESH_TOKEN_NAME, tokens.refresh_token)

            return tokens
        } else {
            throw ForbiddenException
        }
    }

    @Post()
    @DisableAuth()
    async createUser(@Body() data: Omit<CreateUserDTO, "state">): Promise<{user_id: string}> {
        const user = await (this.userService.createUser({...data, state: UserState.UNACTIVE}).toPromise())
        const code = await (this.mailService.sendAccessCode({user_id: user.id, email: user.email}).toPromise())

        return {user_id: user.id}
    }

    @Get("/me")
    async getUserBySessionTokens(@Req() req: ICustomRequest) {
        return await this.userService.findUser({id: req.user_id}).toPromise()
    }
}