import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Sessions } from "./sessions.entity";
import { Activity } from "./activity.entity";
import { Notifications } from "./notifications.entity";
import { UserSettings } from "./user-settings.entity";
import { Posts } from "../posts/post.entity";
import { Files } from "../common/files.entity";
import { Dialogs, Messages } from "../conversation";

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

    @OneToMany(() => Sessions, (session: Sessions) => session.user, {
        cascade: true
    })
    sessions: Sessions[];

    @ManyToMany(() => Users, (users: Users) => users.accounts)
    @JoinTable()
    accounts: Users[];

    @OneToOne(() => Activity, (activity: Activity) => activity.user, {
        cascade: true
    })
    activity: Activity;

    @OneToMany(
        () => Notifications,
        (notifications: Notifications) => notifications.to,
        { cascade: true }
    )
    notifications: Notifications[];

    @OneToOne(() => UserSettings, (settings: UserSettings) => settings.user, {
        cascade: true
    })
    settings: UserSettings;

    @OneToMany(() => Posts, posts => posts.user, { cascade: true })
    posts: Posts[];

    @OneToMany(() => Files, (files: Files) => files.user, { cascade: true })
    files: Files[];

    @ManyToMany(() => Dialogs, (dialogs: Dialogs) => dialogs.users)
    dialogs: Dialogs;

    @OneToMany(() => Messages, (messages: Messages) => messages.user)
    messages: Messages[];
}
