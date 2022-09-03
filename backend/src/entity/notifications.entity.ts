import { EXPIRES_IN_NOTIFICATION } from "src/config";
import { NotificationEnumType } from "src/mysql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Notifications {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false,
        type: "bigint",
        default: Date.now() + EXPIRES_IN_NOTIFICATION
    })
    expirensIn: number;

    @Column({ nullable: false, type: "bigint", default: Date.now() })
    createdAt: number;

    @Column()
    type: NotificationEnumType

    @ManyToOne(() => Users, (user: Users) => user.notifications)
    user: Users

    @ManyToOne(() => Users)
    sender: Users
}