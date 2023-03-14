import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DialogHistory } from "./dialog-history.entity";
import { StateDialogEnum } from "../enums";
import { DialogParticipants } from "./dialog-participants.entity";


// кароче если вкратце то эта штука только для сервера, клиенту же отдаётся ModifyDialog к нему все в сервисах и приводится
@Entity()
export class Dialogs {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @OneToMany(() => DialogParticipants, (participant: DialogParticipants) => participant.dialog)
    participants: DialogParticipants[]

    @Column()
    state: StateDialogEnum

    @Column()
    name: string

    @Column()
    file_id: string

    @OneToOne(() => DialogHistory, (history: DialogHistory) => history.dialog)
    history: DialogHistory
}
