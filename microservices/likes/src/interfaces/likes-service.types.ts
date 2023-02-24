import {Likes} from "../common/entities";
import {FindManyOptions, FindOperator} from "typeorm";

export namespace LikeTypes {
    interface FindRawType {
        [field: string]: FindOperator<Likes>
    }

    export interface FindManyOptionsInterface extends FindManyOptions {}
    export interface CreateLikeInterface extends Omit<Likes, "id" | "createdAt" | "state"> {}

    export interface UpdateLikeInterface extends Omit<Likes, "createdAt"> {}

    export interface FindManyLikesInterface extends Partial<Omit<Likes, "id">> {}

    export interface FindOneLikeInterface extends Partial<Likes> {}
}