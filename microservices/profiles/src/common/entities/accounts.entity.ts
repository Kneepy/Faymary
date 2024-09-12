import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profiles } from "./profile.entity";

@Entity()
export class Accounts {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    user_id: string

    @ManyToOne(() => Profiles, (profile: Profiles) => profile.accounts)
    @JoinColumn()
    profile: Profiles
}