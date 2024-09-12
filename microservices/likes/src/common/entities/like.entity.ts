import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LikeStateEnum } from "../enums/like-state.enum";
import { LikesCollection } from "./likes-collection.entity";

@Entity()
export class Like {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    user_id: string

    @Column({type: "bigint"})
    createdAt: number

    @Column()
    state: LikeStateEnum

    @ManyToOne(() => LikesCollection, (likesCollection: LikesCollection) => likesCollection.likes, {cascade: ["update"]})
    @JoinTable()
    collection: LikesCollection
}