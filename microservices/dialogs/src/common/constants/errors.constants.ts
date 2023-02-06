import { RpcException } from "@nestjs/microservices";

export const NotFoundUserDialogs = new RpcException(
    "Не удалось найти диалоги для этого пользователя!"
);

export const InsufficientRightToMoveDialog = new RpcException(
    "Не достаточно прав для внесения изменений в диалог диалога!"
)

export const NotFoundDialog = new RpcException(
    "Не удалось найти диалог с таким id!"
);
export const ImpossibleAddUserDialog = new RpcException(
    "Не удалось добавить пользователя в диалог!"
);
