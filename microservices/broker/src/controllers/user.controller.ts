import {
    Body,
    Controller, ForbiddenException,
    Inject,
    Post,
    Put,
    Query,
    Req,
} from "@nestjs/common";
import {MAIL_MODULE_CONFIG, SESSION_MODULE_CONFIG, USER_MODULE_CONFIG} from "src/app.constants";
import { SessionServiceClient, VerifyTokensDTO } from "src/proto/session";
import {CreateUserDTO, UserServiceClient, UserState} from "src/proto/user";
import {ConfirmAccessCodeDTO, MailServiceClient} from "../proto/mail";

@Controller("/user")
export class UserController {
    constructor(
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        @Inject(MAIL_MODULE_CONFIG.PROVIDER) private mailService: MailServiceClient,
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient
        ) {}

    @Put()
    async confirmUser(@Req() req, @Query() data: ConfirmAccessCodeDTO): Promise<VerifyTokensDTO> {
        const { isConfirmed } = await this.mailService.confirmAccessCode({user_id: data.user_id, code: data.code}).toPromise()
        const ip = req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for']
        if(isConfirmed) {
            return await this.sessionService.generateTokens({ua: req.headers["user-agent"], fingerprint: req.headers["fingerprint"], user_id: data.user_id, ip}).toPromise()
        } else {
            throw ForbiddenException
        }
    }

    @Post()
    async createUser(@Body() data: Omit<CreateUserDTO, "state">): Promise<{user_id: string}> {
        const user = await (this.userService.createUser({...data, state: UserState.UNACTIVE}).toPromise())
        const code = await (this.mailService.sendAccessCode({user_id: user.id, email: user.email}).toPromise())

        return {user_id: user.id}
    }
}