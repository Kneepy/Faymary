import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { CreateUserDto, LoginUserDto } from "../dto/users";
import bcrypt from "bcryptjs"
import { UsersService } from "src/mysql";
import { Users } from "src/entity";
import { UtilService } from "src/common";
import { AuthService } from "src/auth";
import { ICustomRequest } from "src/common/types";

@Controller("user")
export class UserController { 

    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}

    @Post("create")
    public async createUser(@Body() body: CreateUserDto): Promise<Users> {
        body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(2))
        return await this.userService.create(body)
    }

    @Get("login")
    public async loginUser(@Body() body: LoginUserDto, @Req() req: ICustomRequest, @Res() res) {
        const refreshSession = {
            user: this.userService.findOne({id: body.userId}),
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            ua: req.session.useragent.source
        }
        
    }
}