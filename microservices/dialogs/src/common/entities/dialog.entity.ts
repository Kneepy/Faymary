import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DialogHistory } from "./dialog-history.entity";
import { StateDialogEnum } from "../enums";


// кароче если вкратце то эта штука только для сервера, клиенту же отдаётся ModifyDialog к нему все в сервисах и приводится
@Entity()
export class Dialogs {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    user_ids: string

    @Column()
    creators_ids: string

    @Column()
    state: StateDialogEnum

    @Column()
    name: string

    @Column()
    file_id: string

    @OneToOne(() => DialogHistory, (history: DialogHistory) => history.dialog)
    history: DialogHistory
}
