import {
    Body,
    Controller,
    Inject,
    Post,
    Put,
    Query,
    RequestTimeoutException,
    ForbiddenException,
} from "@nestjs/common";
import {MAIL_MODULE_CONFIG, USER_MODULE_CONFIG} from "src/app.constants";
import {CreateUserDTO, UserServiceClient, UserState} from "src/proto/user";
import {AccessCode, MailServiceClient} from "../proto/mail";

@Controller("/user")
export class UserController {
    constructor(
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        @Inject(MAIL_MODULE_CONFIG.PROVIDER) private mailService: MailServiceClient
    ) {}

    @Put()
    async confirmUser(@Query("code") code: number): Promise<any> {

    }

    @Post()
    async createUser(@Body() data: Omit<CreateUserDTO, "state">): Promise<Pick<AccessCode, "expiresIn" | "createdAt">> {
        const user = await (this.userService.createUser({...data, state: UserState.UNACTIVE}).toPromise())
        const code = await (this.mailService.sendAccessCode({user_id: user.id, email: user.email}).toPromise())

        return {expiresIn: code.expiresIn, createdAt: code.expiresIn}
    }
}