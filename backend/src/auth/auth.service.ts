import { ConfigService } from "src/config/providers/config.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessToken, RefreshToken, Payload } from "./dto";
import { SECRET_ACCESS_JWT, SECRET_REFRESH_JWT } from "src/config";
import { SessionService } from "src/mysql/providers/session.service";
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private sessionService: SessionService,
    ) {}

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

    verifyAccessToken(access_token) {
        return this.jwtService.verify(access_token, {
            secret: SECRET_ACCESS_JWT,
        });
    }
    verifyRefreshToken(refresh_token) {
        return this.jwtService.verify(refresh_token, {
            secret: SECRET_REFRESH_JWT,
        });
    }
}
