import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users";
import { Dialogs } from "./dialogs.entity";

@Entity()
export class DialogUserRelationships {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @OneToOne(() => Dialogs, (dialog: Dialogs) => dialog.relationships)
    @JoinColumn()
    dialog: Dialogs

    @ManyToMany(() => Users)
    @JoinTable()
    inviter: Users

    @ManyToMany(() => Users)
    @JoinTable()
    invited: Users
}