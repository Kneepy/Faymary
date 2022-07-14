import { ConfigService } from 'src/config/providers/config.service';
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { AccessToken, RefreshToken, Payload } from "./dto";
import { SECRET_REFRESH_JWT } from 'src/config';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {} 

    async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        return (this.jwtService.verify(refreshToken, { secret: SECRET_REFRESH_JWT }) && this.jwtService.decode(refreshToken) === userId)
    }

    async getTokens(access_token: AccessToken, refresh_tokzen: RefreshToken): Promise<Payload> {
        return {
            refreshToken: await this.getRefreshToken(refresh_tokzen),
            accessToken: await this.jwtService.signAsync(access_token)
        }
    }

    async getRefreshToken(args: RefreshToken): Promise<string> {
        return await this.jwtService.signAsync(args, this.configService.getJwtRefreshTokenOptions())
    }
}