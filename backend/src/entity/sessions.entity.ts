import { EXPIRENS_IN_REFRESH_TOKEN } from "src/config";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Sessions {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    ua: string // user-agent

    @Column({ nullable: false })
    ip: string

    @Column({ nullable: false, type: "bigint", default: Date.now() + EXPIRENS_IN_REFRESH_TOKEN })
    expirensIn: number

    @Column({ nullable: false, type: "bigint", default: Date.now() })
    createdAt: number

    @OneToMany(() => Users, (user: Users) => user.sessions)
    user: Users
}