import { IsOptional, IsString } from "class-validator";
import { Users } from "src/entity";

export class UpdateUserDto extends Users {
    @IsString()
    @IsOptional()
    newPassword: string

    @IsString()
    @IsOptional()
    oldPassword: string
}