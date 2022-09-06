import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lifetime } from "./common";
import { Users } from "./users.entity";

@Entity()
export class Sessions extends Lifetime {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, type: "text" })
    fingerprint: string;

    @Column({ nullable: false })
    ua: string; // user-agent

    @Column({ nullable: false })
    ip: string;

    @ManyToOne(() => Users, (user: Users) => user.sessions)
    user: Users;
}
