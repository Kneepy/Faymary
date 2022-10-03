import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Files } from "../../entity/common";
import { Users } from "../../entity/users";
import { Posts } from "../posts";
import { Dialogs } from "./dialogs.entity";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    message?: string;

    @ManyToMany(() => Dialogs, (dialog: Dialogs) => dialog.messages)
    @JoinTable()
    dialog: Dialogs;

    @ManyToOne(() => Users, (user: Users) => user.messages)
    @JoinColumn()
    user: Users;

    @ManyToMany(() => Files)
    @JoinTable()
    files?: Files[];

    @ManyToMany(() => Messages)
    @JoinTable()
    answerTo?: Messages

    @ManyToMany(() => Messages)
    @JoinTable()
    forwardedMessages?: Messages[]

    @ManyToMany(() => Posts)
    @JoinTable()
    forwardedPosts?: Posts[]
}
