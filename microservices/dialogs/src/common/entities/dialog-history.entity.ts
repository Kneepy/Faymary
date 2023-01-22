import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
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
    item_id: string

    @Column({type: "bigint"})
    createdAt: number

    @OneToOne(() => Dialogs, (dialog: Dialogs) => dialog.history)
    dialog: Dialogs
}