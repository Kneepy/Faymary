import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Files } from "../../entity/common";
import { Users } from "../../entity/users";
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
