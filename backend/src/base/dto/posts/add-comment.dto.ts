import { Type } from "class-transformer";
import { IsString } from "class-validator";
import { Comments } from "src/entity";

export class AddCommentToPostDto {
    @IsString()
    postId: string;

    @Type(() => Comments)
    comment: Comments;
}

export class AddAnswerToComment {
    @IsString()
    commentId: string;

    @Type(() => Comments)
    answer: Comments;
}
