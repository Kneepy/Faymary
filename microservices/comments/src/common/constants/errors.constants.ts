import {RpcException} from "@nestjs/microservices";

export const NotFoundComment = new RpcException("Не удалось найти комментарий с таким id!")