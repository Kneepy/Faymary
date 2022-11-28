import { RpcException } from "@nestjs/microservices";

export const FileNotFound = new RpcException(
    "Нелья создать историю без файла!"
);
