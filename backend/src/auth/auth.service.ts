import { ConfigService } from "src/config/providers/config.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessToken, RefreshToken, Payload } from "./dto";
import { SECRET_ACCESS_JWT, SECRET_REFRESH_JWT } from "src/config";
import { SessionService } from "src/mysql/providers/session.service";
import { Sessions } from "src/entity";
import { UsersService } from "src/mysql";
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private sessionService: SessionService,
        private userService: UsersService
    ) {}

    async getTokens(
        access_token: AccessToken,
        refresh_token: RefreshToken,
    ): Promise<Payload> {
        return {
            refreshToken: (await this.getRefreshToken(refresh_token)).id,
            accessToken: await this.jwtService.signAsync(access_token),
        };
    }

    async getRefreshToken(args: RefreshToken): Promise<Sessions> {
        const user = await this.userService.findOne({id: args.userId})
        const token = await this.jwtService.signAsync(
            args,
            this.configService.getJwtRefreshTokenOptions(),
        );

        return await this.sessionService.create({ ua: args.ua, ip: args.ip, user, token });
    }

    verifyAccessToken(access_token): AccessToken {
        return this.jwtService.verify(access_token, {
            secret: SECRET_ACCESS_JWT,
        });
    }
    verifyRefreshToken(refresh_token): RefreshToken {
        return this.jwtService.verify(refresh_token, {
            secret: SECRET_REFRESH_JWT,
        });
    }
}
