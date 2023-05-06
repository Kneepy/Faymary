import { Status } from "@grpc/grpc-js/build/src/constants";
import { RpcException } from "@nestjs/microservices";

export const TokenNotFound = new RpcException({
    status: Status.NOT_FOUND,
    message: "Token not found!"
})

export const PoorDataToCreateTokens = new RpcException({
    status: Status.DATA_LOSS,
    message: "Недостаточно данных для создания токенов!"
})

export const Unauthorized = new RpcException({
    status: Status.DATA_LOSS,
    message: "Ошибка авторизации!"
})