import { PrimaryGeneratedColumn, Entity, OneToMany, ManyToMany } from "typeorm";
import { Users, Messages } from "./";

@Entity()
export class Dialogs {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Messages, (message: Messages) => message.dialog)
    messages: Messages[];

    @ManyToMany(() => Users, (users: Users) => users.dialogs)
    users: Users[];
}
