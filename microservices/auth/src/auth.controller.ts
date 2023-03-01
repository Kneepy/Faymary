import { Unauthorized } from './constants/errors.constants';
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { EXPIRES_IN_REFRESH_TOKEN, SESSION_SERVICE, SESSION_SERVICE_METHODS } from "./constants/session.constants";
import { SessionService } from "./services/session.service";
import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { GenerateTokensBySessionDTO, GenerateTokensDTO, VerifyTokensDTO } from "./dtos";
import { AuthService } from "./services";
import { TokensPayload, UserAccessTokenPayload } from "./interfaces";

@Controller()
export class AuthController {
    constructor(
        private sessionService: SessionService,
        private authService: AuthService
    ) {}

    @GrpcMethod(SESSION_SERVICE, SESSION_SERVICE_METHODS.VERIFY_TOKENS)
    async verifyTokens(data: VerifyTokensDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<UserAccessTokenPayload> {
        const verifyAccess = this.authService.verifyAccessToken(data.access_token)
        const verifyRefresh = await this.authService.verifyRefreshToken(data.refresh_token)

        return (!!verifyAccess && !!verifyRefresh) ? verifyAccess as UserAccessTokenPayload : {user_id: null}
    }

    @GrpcMethod(SESSION_SERVICE, SESSION_SERVICE_METHODS.GENERATE_TOKENS)
    async generateTokens(data: GenerateTokensDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<TokensPayload> {
        const oldRefreshToken = await this.sessionService.findOne([{ua: data.ua, user_id: data.user_id}, {ip: data.ip, user_id: data.user_id}])

        if(!!oldRefreshToken) {
            await this.sessionService.delete(oldRefreshToken.id)
        }
        
        return {
            access_token: this.authService.getAccessToken(data.user_id),
            refresh_token: (await this.authService.getRefreshToken(data)).id
        }
    }

    @GrpcMethod(SESSION_SERVICE, SESSION_SERVICE_METHODS.GENERATE_TOKENS_BY_SESSION)
    async generateTokensBySession(data: GenerateTokensBySessionDTO): Promise<TokensPayload> {
        const session = await this.sessionService.findOne({id: data.refresh_token})
        const accessCodeIsVerify = this.authService.verifyAccessToken(data.access_token)

        if(accessCodeIsVerify) {
            if((accessCodeIsVerify as UserAccessTokenPayload).user_id === session.user_id) {
                return {
                    access_token: data.access_token,
                    refresh_token: data.refresh_token
                }
            } else {
                throw Unauthorized
            }
        }
        else {
            if(session) {
                if(session.fingerprint !== data.session.fingerprint || session.createdAt + EXPIRES_IN_REFRESH_TOKEN > Date.now()) {
                    throw Unauthorized
                } else {
                    return {
                        access_token: this.authService.getAccessToken(session.user_id),
                        refresh_token: (await this.authService.getRefreshToken({
                            ua: data.session.ua,
                            fingerprint: data.session.fingerprint,
                            ip: data.session.ip,
                            user_id: session.user_id
                        })).id
                    }
                }
            } else throw Unauthorized
        }
    }
}