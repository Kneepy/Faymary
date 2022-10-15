import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { CreateSession, UserAccessTokenPayload } from "src/interfaces";
import { EXPIRES_IN_REFRESH_TOKEN } from "src/constants/session.constants";
import { SessionService } from "./session.service";
import { Sessions } from "src/entities";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private sessionService: SessionService
    ) {}

    verifyAccessToken(token: string): UserAccessTokenPayload | boolean {
        try {
            return this.jwtService.verify<UserAccessTokenPayload>(token)
        } catch (e) {
            return false
        }
    }

    async verifyRefreshToken(tokenId: string): Promise<Sessions | boolean> {
        const token = await this.sessionService.findOne({id: tokenId})

        if(token) {
            if(token.createdAt + EXPIRES_IN_REFRESH_TOKEN > Date.now()) {
                return false 
            } else {
                return token
            }
        } else {
            return false
        }
    }

    getAccessToken(user_id: string): string {
        return this.jwtService.sign(user_id)
    }

    async getRefreshToken(token: CreateSession) {
        return await this.sessionService.create(token)
    }
}