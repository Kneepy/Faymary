import { Controller, Inject, Post } from "@nestjs/common";
import { USER_MODULE_CONFIG } from "src/app.constants";
import { UserServiceClient } from "src/proto/user";

@Controller("/user")
export class UserController {
    constructor(
        @Inject(USER_MODULE_CONFIG) private userService: UserServiceClient
    ) {}


}