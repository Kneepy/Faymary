import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Files } from "../common/files.entity";
import { Messages } from "../conversation";
import { Users } from "../users/users.entity";
import { Comments } from "./comments.entity";

@Entity()
export class Posts {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false, type: "bigint" })
    createdAt: number;

    @ManyToMany(() => Files)
    @JoinTable()
    files?: Files[] | unknown;

    @Column()
    desc: string;

    @ManyToOne(() => Users, (user: Users) => user.posts)
    user: Users;

    @ManyToMany(() => Comments, (comments: Comments) => comments.post, {
        cascade: true
    })
    comments: Comments[];

    @ManyToMany(() => Users, { cascade: true })
    @JoinTable()
    likes: Users[];
}
