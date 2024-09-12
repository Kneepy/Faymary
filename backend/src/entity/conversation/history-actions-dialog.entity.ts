import { HistoryActionsDialogType } from "src/mysql";
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Files } from "../common";
import { Users } from "../users";
import { Dialogs } from "./dialogs.entity";

@Entity()
export class HistoryActions {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ nullable: false, type: "bigint" })
    createdAt: number;

    @Column({nullable: false})
    type: HistoryActionsDialogType

    @ManyToOne(() => Dialogs, (dialog: Dialogs) => dialog.history)
    @JoinColumn()
    dialog: Dialogs;

    @ManyToMany(() => Users)
    @JoinTable()
    emiter: Users;

    @ManyToMany(() => Users)
    @JoinTable()
    subject: Users;

    @ManyToMany(() => Files)
    file: Files

    @Column({nullable: true})
    payload: string
}
