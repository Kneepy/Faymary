import { RpcException } from "@nestjs/microservices";

export const NotFoundFindParams = new RpcException(
    "Недостаточно параметров для поиска!"
)