import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Files, Dialogs } from "./";
import { Sessions } from "./sessions.entity";

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    email: string;

    @Column({nullable: false})
    firstName: string;

    @Column({nullable: false})
    lastName: string;

    @Column({nullable: true})
    surname: string;

    @Column({nullable: false, default: false})
    isActive: boolean;

    @OneToMany(() => Files, (files: Files) => files.user)
    files: Files[];

    @ManyToMany(() => Users, (user: Users) => user.subscriptions)
    @JoinTable()
    subscribers: Users[];

    @ManyToMany(() => Users, (user: Users) => user.subscribers)
    subscriptions: Users[];

    @ManyToMany(() => Dialogs, (dialog: Dialogs) => dialog.users)
    dialogs: Dialogs[];

    @OneToMany(() => Sessions, (session: Sessions) => session.user)
    sessions: Sessions[];
}
