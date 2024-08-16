import { UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';

export const UnauthorizedError = new UnauthorizedException("Токены авторизации не найдены!")
export const PoorDataError = new UnauthorizedException("Неверные данные для создания сессии!")
export const NotFoundAccount = new NotFoundException("Аккаунт не найден!")
export const IncorrectPasswordError = new ForbiddenException("Введён неверный пароль!")

export const NotFoundMessage = new NotFoundException("Не удалось найти сообщение с таким id!")