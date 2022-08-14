import { EXPIRENS_IN_REFRESH_TOKEN } from "src/config";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Sessions {
    @PrimaryGeneratedColumn("rowid")
    id: string;

    @Column({ nullable: false, type: "text" })
<<<<<<< HEAD
    fingerprint: string
=======
    fingerprint: string;
>>>>>>> hotfix

    @Column({ nullable: false })
    ua: string; // user-agent

    @Column({ nullable: false })
    ip: string;

    @Column({
        nullable: false,
        type: "bigint",
        default: Date.now() + EXPIRENS_IN_REFRESH_TOKEN
    })
    expirensIn: number;

    @Column({ nullable: false, type: "bigint", default: Date.now() })
    createdAt: number;

    @ManyToOne(() => Users, (user: Users) => user.sessions)
    user: Users;
}
