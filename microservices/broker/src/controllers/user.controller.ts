import {
    Body,
    Controller, Delete, ForbiddenException,
    Get,
    Header,
    Headers,
    Inject,
    Patch,
    Post,
    Put,
    Query,
    Req,
    Res,
} from "@nestjs/common";
import {COOKIE_REFRESH_TOKEN_NAME, MAIL_MODULE_CONFIG, PROFILES_MODULE_CONFIG, SESSION_MODULE_CONFIG, USER_MODULE_CONFIG} from "src/constants/app.constants";
import { SessionServiceClient, VerifyTokensDTO } from "src/proto/session";
import {CreateUserDTO, FindFollowersDTO, FindUserDTO, LoginUserDTO, UpdateUserDTO, User, UserIsFollowDTO, UsersIsFollowResult, Users, UserServiceClient, UsersIsFollowDTO, UserState} from "src/proto/user";
import { ICustomRequest } from "src/types/request.type";
import {ConfirmAccessCodeDTO, MailServiceClient} from "../proto/mail";
import { DisableAuth } from "src/disable-auth.decorator";
import { IncorrectPasswordError, NotFoundAccount, PoorDataError } from "src/constants/errors.constants";
import { Account, ProfilesServiceClient } from "src/proto/profiles";
import { ICustomResponse } from "src/types/response.type";
import { SendAccessCodeDTO } from '../proto/mail';

@Controller("/user")
export class UserController {
    constructor(
        @Inject(USER_MODULE_CONFIG.PROVIDER) private userService: UserServiceClient,
        @Inject(MAIL_MODULE_CONFIG.PROVIDER) private mailService: MailServiceClient,
        @Inject(PROFILES_MODULE_CONFIG.PROVIDER) private profilesService: ProfilesServiceClient,
        @Inject(SESSION_MODULE_CONFIG.PROVIDER) private sessionService: SessionServiceClient
    ) {}

    @Put("login")
    @DisableAuth()
    async loginUser(@Body() data: LoginUserDTO): Promise<{user_id: string}> {
        const isLogined = await this.userService.loginUser({email: data.email, password: data.password}).toPromise()

        if(!isLogined.isLogined) throw IncorrectPasswordError

        await this.mailService.sendAccessCode({user_id: isLogined.user.id, email: data.email}).toPromise()
        return {user_id: isLogined.user.id}
    }

    @Post("send-confirm-code")
    @DisableAuth()
    async resendConfirmCode(@Body() data: SendAccessCodeDTO): Promise<{user_id: string}> {
        return await this.mailService.sendAccessCode({user_id: data.user_id, email: data.email}).toPromise()
    }

    @Put("confirm")
    @DisableAuth()
    async confirmUser(@Query() data: ConfirmAccessCodeDTO, @Req() req: ICustomRequest, @Res({ passthrough: true }) res: ICustomResponse): Promise<VerifyTokensDTO> {
        if(!req.headers.fingerprint) throw PoorDataError

        const { isConfirmed } = await this.mailService.confirmAccessCode({user_id: data.user_id, code: data.code}).toPromise()
        const ip = req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for']

        if(!isConfirmed) throw new ForbiddenException()
        
        await this.userService.updateUser({id: data.user_id, state: UserState.ACTIVE}).toPromise()
        const tokens = await this.sessionService.generateTokens({ua: req.headers["user-agent"], fingerprint: req.headers["fingerprint"], user_id: data.user_id, ip}).toPromise()
        const userProfile = await this.profilesService.getProfile({user_id: data.user_id}).toPromise()

        /**
         * Если у пользователя в cookie файлах будут лежать данные о старом аккаунте при его смене то мы будем добавлять 
         * Старый аккаунт в список аккаунтов обоих профилей (откуда вышли и куда вошли)
         * Хз как сократить этот дубляж кода
         */
        if(req.headers.authorization && req.cookies.refresh_token) {
            const oldUserId = await this.sessionService.verifyTokens({access_token: req.headers.authorization, refresh_token: req.cookies.refresh_token}).toPromise()
            if(oldUserId.user_id) {
                const oldUserProfile = await this.profilesService.getProfile({user_id: oldUserId.user_id}).toPromise()
                
                // откуда вышли
                await this.profilesService.addUserAccount({user_id: data.user_id, profile_id: oldUserProfile.id}).toPromise()
                // куда вошли
                await this.profilesService.addUserAccount({user_id: oldUserId.user_id, profile_id: userProfile.id}).toPromise()
            }
        }
        
        await this.profilesService.addUserAccount({user_id: data.user_id, profile_id: userProfile.id}).toPromise()
        res.cookie(COOKIE_REFRESH_TOKEN_NAME, tokens.refresh_token, {httpOnly: true, secure: true, maxAge: 60*60*24*14, path: "/"})

        return tokens
    }

    @Delete("delete-account")
    async deleteAccounts(@Query() data: {account_id: string}, @Req() req: ICustomRequest): Promise<Account> {
        const userProfile = await this.profilesService.getProfile({user_id: req.user_id}).toPromise()
        /**
         * Только если пользователь находится в аккаунтах пользователя, то он сможет удалить аккаунт
         */
        const account = userProfile.accounts.find(acc => acc.user_id === req.user_id) && userProfile.accounts.find(acc => acc.id === data.account_id)

        if(!account) throw NotFoundAccount

        return await this.profilesService.removeUserAccount({user_id: account.user_id, profile_id: userProfile.id}).toPromise()
    }

    @Patch("change-account")
    async changeAccount(@Query() data: {account_id: string}, @Req() req: ICustomRequest, @Res({passthrough: true}) res: ICustomResponse): Promise<VerifyTokensDTO> {
        const userProfile = await this.profilesService.getProfile({user_id: req.user_id}).toPromise()
        /**
         * Только если пользователь находится в аккаунтах пользователя, то он может получить токены авторизации
         */
        const account = userProfile.accounts.find(acc => acc.user_id === req.user_id) && userProfile.accounts.find(acc => acc.id === data.account_id)

        if(!account) throw NotFoundAccount

        const ip = req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for']
        const tokens = await this.sessionService.generateTokens({ua: req.headers["user-agent"], fingerprint: req.headers["fingerprint"], user_id: req.user_id, ip}).toPromise()

        res.cookie(COOKIE_REFRESH_TOKEN_NAME, tokens.refresh_token, {httpOnly: true})

        return tokens
    }

    @Post()
    @DisableAuth()
    async createUser(@Body() data: Omit<CreateUserDTO, "state">): Promise<{user_id: string}> {
        const user = await (this.userService.createUser({...data, state: UserState.UNACTIVE}).toPromise())
        const profileUser = await this.profilesService.createProfile({user_id: user.id}).toPromise()
        const code = await (this.mailService.sendAccessCode({user_id: user.id, email: user.email}).toPromise())

        return {user_id: user.id}
    }

    @Post("auth")
    async getTokensByOldSessionAndAccessToken(@Req() req: ICustomRequest): Promise<VerifyTokensDTO> {

        // получаются при применении к этому маршруту AuthGuard
        return {
            refresh_token: req.headers.refresh_token,
            access_token: req.headers.authorization
        }
    }

    @Get("/me")
    async getUserBySessionTokens(@Req() req: ICustomRequest) {
        return await this.userService.findUser({id: req.user_id}).toPromise()
    }

    @Patch()
    async updateUser(@Req() req: ICustomRequest, @Body() data: Omit<UpdateUserDTO, "id">): Promise<User> {
        return await this.userService.updateUser({...data, id: req.user_id}).toPromise()
    }

    @Get("/user_is_follow")
    async userIsFollow(@Req() req: ICustomRequest, @Query() data: Pick<UserIsFollowDTO, "user_id">) : Promise<boolean> {
        return (await this.userService.userIsFollow({author_id: data.user_id, user_id: req.user_id}).toPromise()).isFollow
    }

    @Get("/users_is_follow")
    async usersIsFollow(@Req() req: ICustomRequest, @Query() data: Pick<UsersIsFollowDTO, "users_ids">): Promise<UsersIsFollowResult> {
        return await this.userService.usersIsFollow({author_id: req.user_id, users_ids: data.users_ids}).toPromise()
    }


    /**
     * Все эндпоинты не требующие аутентификации или создания пользователя
     */
    @Get()
    @DisableAuth()
    async getUser(@Query() query: FindUserDTO, @Res({passthrough: true}) h: ICustomResponse): Promise<User> {
        return await this.userService.findUser(query).toPromise()
    }

    @Get("/followers")
    @DisableAuth()
    async getFollowers(@Query() query: FindFollowersDTO): Promise<Users> {
        return await this.userService.findFollowers(query).toPromise()
    }

    @Get("/subscriptions")
    @DisableAuth()
    async getSubscriptions(@Query() query: FindFollowersDTO): Promise<Users> {
        return await this.userService.findSubscriptions(query).toPromise()
    }
}