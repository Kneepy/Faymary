import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Accounts } from "./accounts.entity";

@Entity()
export class Profiles {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    user_id: string

    @Column({default: true})
    commentsNotification: boolean

    @Column({default: true})
    likesNotification: boolean

    @Column({default: true})
    subscriptionNotifications: boolean

    @Column({default: true})
    deleteDialogNotifications: boolean

    @Column({default: true})
    exceptionsFromDialogsNotifications: boolean

    @OneToMany(() => Accounts, (account: Accounts) => account.profile, {cascade: true})
    accounts: Accounts[]
}