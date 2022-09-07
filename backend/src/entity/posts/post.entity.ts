import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users/users.entity";

@Entity()
export class Posts {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({nullable: false})
    title: string

    @Column({ nullable: false, type: "bigint" })
    createdAt: number

    @Column()
    desc: string

    @ManyToOne(() => Users, (user: Users) => user.posts)
    user: Users
}