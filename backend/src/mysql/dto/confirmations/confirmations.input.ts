import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmationsInput {
    @IsString()
    @IsNotEmpty()
    code: string
}