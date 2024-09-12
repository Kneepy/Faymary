import { RpcException } from "@nestjs/microservices";

export const NotFoundNotification = new RpcException(
    "Не удалось найти уведомления для этого пользователя!"
);
export const ImpossibleCreateNotification = new RpcException(
    "Не удалось создать уведомление!"
);
