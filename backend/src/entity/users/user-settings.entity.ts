import { NotificationEnumType } from "src/mysql";
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
    @Reflect.metadata("notificationType", () => NotificationEnumType.SUB)
    subscriptionNotifications: boolean;

    @Column({ nullable: false, default: true })
    commentsOnPostNotifications: boolean;

    @Column({ nullable: false, default: true })
    answersOnCommentNotification: boolean;

    @Column({ nullable: false, default: true })
    likeOnPostNotifications: boolean;

    @Column({ nullable: false, default: true })
    likeOnCommentNotification: boolean;

    @Column({ nullable: false, default: true })
    addMeToDialogNotification: boolean;

    @OneToOne(() => Users, (user: Users) => user.settings)
    @JoinColumn()
    user: Users;
}
