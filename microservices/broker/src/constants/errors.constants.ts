import { UnauthorizedException, NotFoundException } from '@nestjs/common';

export const UnautorizedError = new UnauthorizedException("Токены авторизации не найдены!")
export const PoorDataError = new UnauthorizedException("Недостаточно данных для создания сессии!")
export const NotFoundAccount = new NotFoundException("Аккаунт не найден!")