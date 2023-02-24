import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DialogHistory } from "./dialog-history.entity";
import { StateDialogEnum } from "../enums";

@Entity()
export class Dialogs {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    user_ids: string

    @Column()
    creator_id: string

    @Column()
    state: StateDialogEnum

    @Column()
    name: string

    @Column()
    file_id: string

    @OneToOne(() => DialogHistory, (history: DialogHistory) => history.dialog)
    history: DialogHistory
}
