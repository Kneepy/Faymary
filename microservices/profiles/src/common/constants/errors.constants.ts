import { RpcException } from '@nestjs/microservices';

export const NotFoundProfileError = new RpcException(
    "Не удалость найти профиль с такими параметрами!"
)