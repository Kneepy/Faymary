import { RpcException } from "@nestjs/microservices";

export const NotFoundDialog = new RpcException(
    "Не удалось найти диалог с таким id!"
);
export const NotFoundMessage = new RpcException(
    "Не удалось найти сообщение с таким id!"
);
export const FailedDeleteMessage = new RpcException(
    "Не удалось удалить сообщение!"
)