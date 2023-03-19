import { UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export const ERRORS = {
    UNAUTHORIZED: "Токены авторизации не найдены!",
    NOT_ENOUGHT_DATA_TO_CREATE_SESSION: "Недостаточно данных для создания сессии!"
}

export const WsUnautorizedError = new WsException(ERRORS.UNAUTHORIZED)
export const UnautorizedError = new UnauthorizedException(ERRORS.UNAUTHORIZED)
export const PoorDataError = new UnauthorizedException(ERRORS.NOT_ENOUGHT_DATA_TO_CREATE_SESSION)