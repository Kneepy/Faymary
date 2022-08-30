import {
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessToken, RefreshToken, Payload } from "./dto";
import { SECRET_ACCESS_JWT } from "src/config";
import { Sessions } from "src/entity";
import { UsersService } from "../mysql/providers/users.service";
import { SessionService } from "src/mysql/providers/session.service";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private sessionService: SessionService,
        private userService: UsersService
    ) {}

    async getTokens(
        access_token: AccessToken,
        refresh_token: RefreshToken
    ): Promise<Payload> {
        return {
            refreshToken: (await this.getRefreshSession(refresh_token)).id,
            accessToken: await this.jwtService.signAsync(access_token)
        };
    }

    async getRefreshSession(args: RefreshToken): Promise<Sessions> {
        const user = await this.userService.findOne({ id: args.userId });

        return await this.sessionService.create({
            ua: args.ua,
            ip: args.ip,
            fingerprint: args.fingerprint,
            user
        });
    }

    verifyAccessToken(access_token: string): AccessToken {
        return this.jwtService.verify(access_token, {
            secret: SECRET_ACCESS_JWT
        });
    }

    async verifyRefreshToken(refresh_token: string): Promise<Sessions> {
        const session = await this.sessionService.findOne(
            { id: refresh_token },
            { relations: ["user"] }
        );
        
        if (session.expirensIn < Date.now()) {
            throw new UnauthorizedException();
        }

        return session;
    }
}
