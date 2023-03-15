import { UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export const ERRORS = {
    UNAUTHORIZED: "Токены авторизации не найдены!",
}

export const WsUnautorizedError = new WsException(ERRORS.UNAUTHORIZED)
export const UnautorizedError = new UnauthorizedException(ERRORS.UNAUTHORIZED)