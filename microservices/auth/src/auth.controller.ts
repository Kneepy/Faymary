import { PoorDataToCreateTokens, Unauthorized } from './constants/errors.constants';
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

        if(!!verifyRefresh && !!verifyAccess && (verifyRefresh.user_id === verifyAccess.user_id)) {
            return verifyAccess
        } else return {user_id: null}
    }

    @GrpcMethod(SESSION_SERVICE, SESSION_SERVICE_METHODS.GENERATE_TOKENS)
    async generateTokens(data: GenerateTokensDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<TokensPayload> {
        if(!data.fingerprint || !data.ua || !data.ip || !data.user_id) throw PoorDataToCreateTokens

        /**
         * Я тут даже хз, нужно по идее вообще убрать проверку по ua и ip, скорее всего так и сделаю (если что то она тут была)
         */
        const oldRefreshToken = await this.sessionService.findOne([{ua: data.ua, user_id: data.user_id}, {fingerprint: data.fingerprint, user_id: data.user_id}])

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
        if(!data.refresh_token) throw Unauthorized

        const session = await this.authService.verifyRefreshToken(data.refresh_token)
        const accessCodeIsVerify = this.authService.verifyAccessToken(data.access_token)

        if(!session) throw Unauthorized

        /**
         * Знаю что дубляж кода и всё такое, заморачивться не хочется
         * Логика такая что если access_token ещё существет то мы отдаём пользователю ту же сессию что он и отправил
         * С проверкой fingerprint'а, т.к если он не будет верен то мы удаляем сессию
         * Если access_token'а нет то удаляем старую сессию и создаём новую, с проверкой fingerprint'а
         */
        if(data.session.fingerprint !== session.fingerprint || Date.now() > session.createdAt + EXPIRES_IN_REFRESH_TOKEN) {
            await this.sessionService.delete(session.id)
            throw Unauthorized
        }
        if(!!accessCodeIsVerify.user_id) {
            return {
                access_token: data.access_token,
                refresh_token: data.refresh_token
            }
        }
        else {
            await this.sessionService.delete(session.id)
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
    }
}