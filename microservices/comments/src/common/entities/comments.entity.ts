import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {CommentStateEnum, CommentTypeEnum} from "../enums";

@Entity()
export class Comments {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    msg: string

    @Column({nullable: true})
    file_ids: string
    
    @Column()
    user_id: string

    @Column()
    item_id: string

    @Column()
    type: CommentTypeEnum

    @Column({type: "bigint"})
    createdAt: number

    @Column()
    state: CommentStateEnum
}