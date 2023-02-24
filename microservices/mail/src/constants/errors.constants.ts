import {RpcException} from "@nestjs/microservices";

export const NotFoundEmail = new RpcException("Почта не найдена!")