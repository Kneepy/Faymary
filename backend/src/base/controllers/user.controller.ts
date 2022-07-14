import { Controller, Get, Post } from "@nestjs/common";

@Controller("user")
export class UserController { 

    @Get("login")
    public async loginUser() {
        
    }
}