import { IsNotEmpty, IsString } from "class-validator";

export class AddUserToDialogDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    dialogId: string;
}
