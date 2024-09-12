import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Users, Files, Dialogs, Messages, Posts } from "src/entity";

export class MessagesInput implements Omit<Messages, "id"> {
    @IsString()
    @IsOptional()
    message?: string;

    @IsNotEmpty()
    @Type(() => Users)
    user: Users;

    @IsNotEmpty()
    @Type(() => Dialogs)
    dialog: Dialogs;

    @Type(() => Files)
    @IsOptional()
    files?: Files[];

    @IsOptional()
    @Type(() => Messages)
    forwardedMessages?: Messages[];

    @IsOptional()
    @Type(() => Messages)
    answerTo?: Messages;

    @Type(() => Posts)
    @IsOptional()
    forwardedPost?: Posts;
}
