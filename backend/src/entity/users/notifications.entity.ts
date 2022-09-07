import { NotificationEnumType } from "src/mysql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lifetime } from "../common";
import { Users } from "./users.entity";

@Entity()
export class Notifications extends Lifetime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: NotificationEnumType;

    @ManyToOne(() => Users, (user: Users) => user.notifications)
    user: Users;

    @ManyToOne(() => Users)
    sender: Users;
}
