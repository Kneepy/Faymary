import { EXPIRES_IN_CONFORMATION } from "src/config";
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
        default: () => Date.now() + EXPIRES_IN_CONFORMATION
    })
    expirensIn: number;

    @Column({ nullable: false, type: "bigint", default: Date.now() })
    createdAt: number;

    @OneToOne(() => Users)
    @JoinColumn()
    user: Users;
}
