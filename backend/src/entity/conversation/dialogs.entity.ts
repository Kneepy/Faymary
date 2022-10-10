import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "../../entity/users";
import { Files } from "../common";
import { HistoryActions } from "./history-actions-dialog.entity";
import { Messages } from "./messages.entity";

@Entity()
export class Dialogs {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true })
    title?: string;

    @ManyToOne(() => Files)
    @JoinColumn()
    frontFile: Files;

    @ManyToMany(() => Users, (users: Users) => users.dialogs)
    @JoinTable()
    users: Users[];

    @ManyToOne(() => Users)
    @JoinColumn()
    creator: Users;

    @OneToMany(
        () => HistoryActions,
        (relationships: HistoryActions) => relationships.dialog
    )
    history: HistoryActions[];

    @ManyToMany(() => Messages, (message: Messages) => message.dialog)
    messages: Messages[];
}
