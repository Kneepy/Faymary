import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Files, Dialogs } from "./";

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    surname: string;

    @Column()
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
}
