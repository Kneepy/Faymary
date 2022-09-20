import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Files } from "../common";
import { Users } from "../users";
import { Dialogs } from "./dialogs.entity";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    message: string;

    @OneToMany(() => Dialogs, (dialog: Dialogs) => dialog.messages)
    @JoinColumn()
    dialog: Dialogs;

    @OneToMany(() => Users, (user: Users) => user.messages)
    @JoinColumn()
    user: Users;

    @ManyToMany(() => Dialogs, (dialog: Dialogs) => dialog.files, {cascade: true})
    @JoinTable()
    files: Files[];
}
