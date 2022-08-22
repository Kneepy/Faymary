import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmationsArgs {
    @IsString()
    @IsNotEmpty()
    id: string
}