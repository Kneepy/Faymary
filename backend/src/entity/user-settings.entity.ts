import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class UserSettings {
    @Column({nullable: false, default: true})
    subscriptionNotifications: boolean

    @OneToOne(() => Users, (user: Users) => user.settings)
    @JoinColumn()
    user: Users
}