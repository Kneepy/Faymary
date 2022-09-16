import { IsNotEmpty, IsString } from "class-validator";

export class AddLikeToPostDto {
    @IsString()
    @IsNotEmpty()
    userId: string

    @IsNotEmpty()
    @IsString()
    postId: string
}