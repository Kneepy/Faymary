import { IsNotEmpty, IsNumber } from "class-validator";

export class DialogsArgs {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}
