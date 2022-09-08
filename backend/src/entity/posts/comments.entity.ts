import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Files } from "../common";
import { Users } from "../users";
import { Posts } from "./post.entity";

@Entity()
export class Comments {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToMany(() => Files)
    files: Files[]

    @Column({nullable: false})
    message: string

    @ManyToOne(() => Users)
    @JoinColumn()
    user: Users

    @ManyToMany(() => Comments)
    @JoinTable()
    answers: Comments[]

    @ManyToOne(() => Posts, (post: Posts) => post.comments)
    @JoinColumn()
    post: Posts
}