import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { JwtDto } from "./dto";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) {}

    async 

    async jwtSign(args: JwtDto) {
        return await this.jwtService.signAsync(args)
    }
}