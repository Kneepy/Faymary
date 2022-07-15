import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { CreateUserDto, LoginUserDto } from "../dto/users";
import bcrypt from "bcryptjs";
import { UsersService } from "src/mysql";
import { Users } from "src/entity";
import { AuthService } from "src/auth";
import { ICustomRequest } from "src/common/types";
import { Payload } from "src/auth/dto";

@Controller("user")
export class UserController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) {}

    @Post("create")
    public async createUser(
        @Body() body: CreateUserDto,
        @Req() req: ICustomRequest,
    ): Promise<{ user: Users; tokens: Payload }> {
        body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(2));

        const user = await this.userService.create(body);
        const accessToken = { userId: user.id };
        const refreshToken = {
            user,
            ua: req.session.useragent.source,
            ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        };

        return {
            user: user,
            tokens: await this.authService.getTokens(accessToken, refreshToken),
        };
    }

    @Get("login")
    public async loginUser(
        @Body() body: LoginUserDto,
        @Req() req: ICustomRequest,
        @Res() res,
    ) {
        const refreshSession = {
            user: this.userService.findOne({ id: body.userId }),
            ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
            ua: req.session.useragent.source,
        };
    }
}
