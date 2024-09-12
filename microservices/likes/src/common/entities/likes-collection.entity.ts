import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Like } from "./like.entity";

@Entity()
export class LikesCollection {
    @PrimaryGeneratedColumn("uuid")
    id: string

    /**
     * колонка по которой можно объеденить несколько лайков
     * все лайки с пивом, клоуном, лайком, и т.п
     */
    @Column()
    unity: string

    /**
     * Количество активных лайков
     */
    @Column()
    number_likes: number

    @OneToMany(() => Like, (like: Like) => like.collection, { cascade: true })
    likes: Like[]
}