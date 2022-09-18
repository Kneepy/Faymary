import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class UserSettings {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, default: true })
    subscriptionNotifications: boolean;

    @Column({ nullable: false, default: true })
    commentsOnPostNotifications: boolean;

    @Column({nullable: false, default: true})
    answersOnCommentNotification: boolean

    @Column({ nullable: false, default: true })
    likeOnPostNotifications: boolean;

    @Column({nullable: false, default: true})
    likeOnCommentNotification: boolean

    @OneToOne(() => Users, (user: Users) => user.settings)
    @JoinColumn()
    user: Users;
}
