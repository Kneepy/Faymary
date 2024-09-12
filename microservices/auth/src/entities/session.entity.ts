import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

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

    @Column({ nullable: false })
    user_id: string;

    @Column({ nullable: false, type: "bigint" })
    createdAt: number;
}
