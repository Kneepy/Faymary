import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { DialogActionEnum } from "../enums";
import { Dialogs } from "./dialog.entity";

@Entity()
export class DialogHistory {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    user_id: string

    @Column()
    action: DialogActionEnum

    @Column({nullable: true})
    item_id?: string

    @Column({nullable: true})
    desc?: string

    @Column({type: "bigint"})
    createdAt: number

    @ManyToOne(() => Dialogs, (dialog: Dialogs) => dialog.history)
    @JoinColumn()
    dialog: Dialogs
}