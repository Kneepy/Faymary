import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Confirmations {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    code: string;

    @Column({
        nullable: false,
        type: "bigint",
    })
    expirensIn: number;

    @Column({ nullable: false, type: "bigint" })
    createdAt: number;

    @OneToOne(() => Users)
    @JoinColumn()
    user: Users;
}
