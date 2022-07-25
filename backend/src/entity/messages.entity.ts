import {
    PrimaryGeneratedColumn,
    Entity,
    ManyToOne,
    Column,
    JoinColumn,
    OneToOne
} from "typeorm";
import { Dialogs, Users } from "./";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @ManyToOne(() => Dialogs, (dialog: Dialogs) => dialog.messages)
    @JoinColumn()
    dialog: Dialogs[];

    @OneToOne(() => Users)
    user: Users;
}
