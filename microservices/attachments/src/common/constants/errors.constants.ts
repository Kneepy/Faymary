import { RpcException } from "@nestjs/microservices";

export const UnknownTypesError = new RpcException("Неизвестные типы передаваемых вложений!")

export const PoorDataError = new RpcException("Недостаточно данных для создания вложения!")