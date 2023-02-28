import { RpcException } from "@nestjs/microservices";

export const ShortPasswordError = new RpcException("Слишком короткий пароль!")
export const IncorrectEmailError = new RpcException("Введён некоректный адрес электронной почты!")
export const UserAlredyExist = new RpcException("Пользователь с таким email уже существует!")
export const UserIdNotFound = new RpcException("Идентификатор пользователя не найден")
export const UserEmailNotFound = new RpcException("Пользователя с таким email не найдено")