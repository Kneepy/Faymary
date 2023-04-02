import { UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';

export const UnautorizedError = new UnauthorizedException("Токены авторизации не найдены!")
export const PoorDataError = new UnauthorizedException("Недостаточно данных для создания сессии!")
export const NotFoundAccount = new NotFoundException("Аккаунт не найден!")
export const IncorrectPasswordError = new ForbiddenException("Введён неверный пароль!")