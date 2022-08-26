import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Users } from "src/entity";

export class ConfirmationsInput {
    @IsString()
    @IsNotEmpty()
    code: string

    @Type(() => Users)
    @IsNotEmpty()
    user: Users
}