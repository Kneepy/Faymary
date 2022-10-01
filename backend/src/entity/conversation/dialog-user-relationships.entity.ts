import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lifetime } from "../common";
import { Users } from "../users";
import { Dialogs } from "./dialogs.entity";

@Entity()
export class DialogUserRelationships {
    @PrimaryGeneratedColumn("uuid")
    id?: string

    @Column({nullable: false, type: "bigint"})
    createdAt: number

    @OneToOne(() => Dialogs, (dialog: Dialogs) => dialog.relationships)
    @JoinColumn()
    dialog: Dialogs

    @ManyToMany(() => Users)
    @JoinTable()
    emmiter: Users

    @ManyToMany(() => Users)
    @JoinTable()
    subject: Users
}