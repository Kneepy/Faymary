import { RpcException } from "@nestjs/microservices";

export const FileNotFound = new RpcException(
    "Нелья создать историю без файла!"
);
export const StoryNotFound = new RpcException("История не найдена!")
export const UserDoesNotMatch = new RpcException("Заявленный пользователь не соответствует объявленному в истории")