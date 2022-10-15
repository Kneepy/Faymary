import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { SESSION_SERVICE, SESSION_SERVICE_METHODS } from "./constants/session.constants";
import { SessionService } from "./services/session.service";
import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { GenerateTokensDTO, VerifyTokensDTO } from "./dtos";
import { AuthService } from "./services";
import { TokensPayload, UserAccessTokenPayload } from "./interfaces";
import { Unauthorized } from "./constants";

@Controller()
export class AuthController {
    constructor(
        private sessionService: SessionService,
        private authService: AuthService
    ) {}

    @GrpcMethod(SESSION_SERVICE, SESSION_SERVICE_METHODS.VERIFY_TOKENS)
    async verifyTokens(data: VerifyTokensDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<UserAccessTokenPayload | boolean> {
        const verifyAccess = this.authService.verifyAccessToken(data.access_token)
        const verifyRefresh = await this.authService.verifyRefreshToken(data.refresh_token)

        return (!!verifyAccess && !!verifyRefresh) && verifyAccess
    }

    @GrpcMethod(SESSION_SERVICE, SESSION_SERVICE_METHODS.GENERATE_TOKENS)
    async generateTokens(data: GenerateTokensDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<TokensPayload> {
        const oldRefreshToken = await this.sessionService.findOne({id: data.old_refresh_token})
        
        await this.sessionService.delete(oldRefreshToken.id)
        
        if(!(!!oldRefreshToken) || oldRefreshToken.fingerprint !== data.fingerprint || oldRefreshToken.ip !== data.ip) {
            throw Unauthorized
        }    

        return {
            access_token: this.authService.getAccessToken(data.user_id),
            refresh_token: (await this.authService.getRefreshToken(data)).id
        }
    }
}