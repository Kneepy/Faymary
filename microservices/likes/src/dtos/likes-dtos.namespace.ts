import {Likes} from "../common/entities";
import {LikeTypeEnum} from "../common/enums";

export namespace LikesDTO {

    // типа ислкючаем стейт потому-что если мы его только создали то он не может быть равным 0
    export class AddLikeDTO implements Omit<Likes, "id" | "createdAt" | "state"> {
        item_id: string;
        type: LikeTypeEnum;
        user_id: string;
    }
}