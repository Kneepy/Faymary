import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Files, Messages, Posts } from "src/entity";

export class CreateMessageDto
    implements Omit<Messages, "id" | "dialog" | "user">
{
    @IsString()
    @IsOptional()
    message: string;

    @IsNotEmpty()
    @IsString()
    dialogId: string;

    @Type(() => Files)
    @IsOptional()
    files: Files[];

    @Type(() => Files)
    @IsOptional()
    voice: Files

    @Type(() => Messages)
    @IsOptional()
    answerTo?: Messages;

    @Type(() => Messages)
    @IsOptional()
    forwardedMessages?: Messages[];

    @Type(() => Posts)
    @IsOptional()
    forwardedPosts?: Posts[];
}
