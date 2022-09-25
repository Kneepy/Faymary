import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Files } from "../common/files.entity";
import { Users } from "../users/users.entity";
import { Posts } from "./post.entity";

@Entity()
export class Comments {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToMany(() => Files)
    @JoinTable()
    files: Files[];

    @Column({ nullable: false })
    message: string;

    @ManyToOne(() => Users)
    @JoinColumn()
    user: Users;

    @ManyToMany(() => Comments, { cascade: true })
    @JoinTable()
    answers: Comments[];

    @ManyToMany(() => Posts, (post: Posts) => post.comments)
    @JoinTable()
    post: Posts;

    @ManyToMany(() => Users)
    @JoinTable()
    likes: Users[];
}
