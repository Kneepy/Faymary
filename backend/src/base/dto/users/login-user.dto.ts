import { IsNotEmpty, IsUUID } from "class-validator";
import { NotNull, UserExist } from "src/base/decorators/user-exist.decorator";

export class LoginUserDto {
    @UserExist()
    @NotNull()
    userId: string;
}
