import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
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

    @ManyToMany(() => Dialogs, (dialog: Dialogs) => dialog.messages)
    dialog: Dialogs;

    @ManyToOne(() => Users, (user: Users) => user.messages)
    @JoinColumn()
    user: Users;

    @ManyToMany(() => Files)
    files: Files[];
}
