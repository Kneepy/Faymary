import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {LikeTypeEnum} from "../enums";
import {LikeStateEnum} from "../enums/like-state.enum";

@Entity()
export class Likes {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    type: LikeTypeEnum

    @Column()
    item_id: string

    @Column()
    user_id: string

    @Column({type: "bigint"})
    createdAt: number

    @Column()
    state: LikeStateEnum
}