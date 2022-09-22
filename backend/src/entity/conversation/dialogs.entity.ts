import {
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Files } from "../common";
import { Users } from "../users";
import { Messages } from "./messages.entity";

@Entity()
export class Dialogs {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToMany(() => Users, (users: Users) => users.dialogs)
    @JoinTable()
    users: Users[];

    @ManyToMany(() => Messages, (message: Messages) => message.dialog, {cascade: true})
    @JoinTable()
    messages: Messages[];
}
