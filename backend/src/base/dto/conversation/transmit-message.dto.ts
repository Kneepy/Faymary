import { ArrayMinSize, IsNotEmpty } from "class-validator";

export class TransmitMessageToDialogDto {
    @IsNotEmpty()
    @ArrayMinSize(1)
    messageIds: string[];

    @IsNotEmpty()
    dialogId: string;
}
