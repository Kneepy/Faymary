import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "../../entity/users";
import { DialogUserRelationships } from "./dialog-user-relationships.entity";
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

    @ManyToOne(() => Users)
    @JoinColumn()
    creator: Users

    @OneToOne(() => DialogUserRelationships, (relationships: DialogUserRelationships) => relationships.dialog)
    relationships: DialogUserRelationships[]

    @ManyToMany(() => Messages, (message: Messages) => message.dialog)
    @JoinTable()
    messages: Messages[];
}
