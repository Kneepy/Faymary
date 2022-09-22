import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Files } from "../common";
import { Users } from "../users";
import { Messages } from "./messages.entity";

@Entity()
export class Dialogs {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: true})
    title?: string

    @ManyToMany(() => Users, (users: Users) => users.dialogs)
    @JoinTable()
    users: Users[];

    @ManyToMany(() => Messages, (message: Messages) => message.dialog)
    @JoinTable()
    messages: Messages[];
}
