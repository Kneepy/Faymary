import { IsNotEmpty, IsString } from "class-validator";

export class RemoveUserFromDialog {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    dialogId: string;
}
