import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ParticipantRights } from "../enums";
import { Dialogs } from "./dialog.entity";

@Entity()
export class DialogParticipants {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    rights: ParticipantRights

    @Column()
    user_id: string

    @ManyToOne(() => Dialogs, (dialog: Dialogs) => dialog.participants, {cascade: true})
    @JoinColumn()
    dialog: Dialogs
}