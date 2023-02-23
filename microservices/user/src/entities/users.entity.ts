import { UserState } from "src/user-state.enum";
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    userName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
    password: string;

    @ManyToMany(() => Users, (users: Users) => users.subscriptions)
    @JoinTable()
    followers: Users[]

    @ManyToMany(() => Users, (users: Users) => users.followers) 
    subscriptions: Users[]

    @Column({ nullable: false })
    state: UserState
}
