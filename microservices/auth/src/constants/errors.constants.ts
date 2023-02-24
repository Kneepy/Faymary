import { Status } from "@grpc/grpc-js/build/src/constants";
import { RpcException } from "@nestjs/microservices";

export const TokenNotFound = new RpcException({
    status: Status.NOT_FOUND,
    message: "Tocken not found!"
})

export const Unauthorized = new RpcException({
    status: Status.DATA_LOSS,
    message: "Ошибка авторизации!"
})