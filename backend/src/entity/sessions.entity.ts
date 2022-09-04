import { EXPIRENS_IN_REFRESH_TOKEN } from "src/config";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Sessions {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, type: "text" })
    fingerprint: string;

    @Column({ nullable: false })
    ua: string; // user-agent

    @Column({ nullable: false })
    ip: string;

    @Column({
        nullable: false,
        type: "bigint"
    })
    expirensIn: number;

    @Column({ nullable: false, type: "bigint" })
    createdAt: number;

    @ManyToOne(() => Users, (user: Users) => user.sessions)
    user: Users;
}
