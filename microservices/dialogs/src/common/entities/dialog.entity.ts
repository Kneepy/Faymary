import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DialogHistory } from "./dialog-history.entity";

@Entity()
export class Dialogs {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    user_ids: string

    @OneToOne(() => DialogHistory, (history: DialogHistory) => history.dialog)
    history: DialogHistory
}
