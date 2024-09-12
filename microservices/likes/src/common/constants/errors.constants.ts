import { RpcException } from "@nestjs/microservices";

export const NotFoundFindParams = new RpcException(
    "Недостаточно параметров для поиска!"
)

export const NotFoundCollection = new RpcException(
    "Не удалось найди коллекцию с таким id"
)