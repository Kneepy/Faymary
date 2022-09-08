import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Files } from "../common";
import { Users } from "../users/users.entity";
import { Comments } from "./comments.entity";

@Entity()
export class Posts {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({nullable: false})
    title: string

    @Column({ nullable: false, type: "bigint" })
    createdAt: number

    @ManyToMany(() => Files)
    @JoinTable()
    files: Files[]

    @Column()
    desc: string

    @ManyToOne(() => Users, (user: Users) => user.posts)
    user: Users

    @OneToMany(() => Comments, (comments: Comments) => comments.post)
    comments: Comments[]
}