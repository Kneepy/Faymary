import { RpcException } from "@nestjs/microservices";

export const USER_ID_UNDEFINED = new RpcException("Идентификатор пользователя не обнружен!")
export const POST_ID_UNDEFINED = new RpcException("Идентификатор записи не обнружен!")
export const POST_NOT_FOUND = new RpcException("Записи с таким id не найдено!")
export const UNAVAILABLE_OPERATION = new RpcException("Не удалось выполнить опрецию!")