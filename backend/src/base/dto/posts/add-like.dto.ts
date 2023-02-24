import { IsNotEmpty, IsString } from "class-validator";

export class AddLikeToPostDto {
    @IsNotEmpty()
    @IsString()
    postId: string;
}

export class AddLikeToCommentDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    @IsString()
    commentId: string;
}
