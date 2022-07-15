import { ConfigService } from "src/config/providers/config.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessToken, RefreshToken, Payload } from "./dto";
import { SECRET_REFRESH_JWT } from "src/config";
import { SessionService } from "src/mysql/providers/session.service";
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private sessionService: SessionService,
    ) {}

    async validateRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<boolean> {
        return (
            this.jwtService.verify(refreshToken, {
                secret: SECRET_REFRESH_JWT,
            }) && this.jwtService.decode(refreshToken) === userId
        );
    }

    async getTokens(
        access_token: AccessToken,
        refresh_token: RefreshToken,
    ): Promise<Payload> {
        return {
            refreshToken: await this.getRefreshToken(refresh_token),
            accessToken: await this.jwtService.signAsync(access_token),
        };
    }

    async getRefreshToken(args: RefreshToken): Promise<string> {
        const dataToken = { ...args, userId: args.user.id };
        const token = await this.jwtService.signAsync(
            dataToken,
            this.configService.getJwtRefreshTokenOptions(),
        );
        const session = await this.sessionService.create({ ...args, token });

        return token;
    }
}
