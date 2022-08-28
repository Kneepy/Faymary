import {
    PrimaryGeneratedColumn,
    Entity,
    ManyToOne,
    Column,
    JoinColumn,
    OneToOne
} from "typeorm";
import { Users } from "./users.entity";
import { Dialogs } from "./dialogs.entity";

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
