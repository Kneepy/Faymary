import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Sessions } from "./sessions.entity";
import { Activity } from "./activity.entity";
import { Notifications } from "./notifications.entity";

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

    @ManyToMany(() => Users, (user: Users) => user.subscriptions)
    @JoinTable()
    subscribers: Users[];

    @ManyToMany(() => Users, (user: Users) => user.subscribers)
    subscriptions: Users[];

    @OneToMany(() => Sessions, (session: Sessions) => session.user)
    sessions: Sessions[];

    @ManyToMany(() => Users, (users: Users) => users.accounts)
    accounts: Users[];

    @OneToOne(() => Activity, (activity: Activity) => activity.user)
    activity: Activity

    @OneToMany(() => Notifications, (notifications: Notifications) => notifications.user)
    notifications: Notifications[]
}
