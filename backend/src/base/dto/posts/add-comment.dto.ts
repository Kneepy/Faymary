import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Comments } from "src/entity";

export class AddCommentToPostDto {
    @IsNotEmpty()
    @IsString()
    postId: string;

    @IsNotEmpty()
    @Type(() => Comments)
    comment: Comments;
}

export class AddAnswerToComment {
    @IsString()
    commentId: string;

    @Type(() => Comments)
    answer: Comments;
}
