import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Lifetime } from "../common";
import { Users } from "./users.entity";

@Entity()
export class Confirmations extends Lifetime {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    code: string;

    @OneToOne(() => Users)
    @JoinColumn()
    user: Users;
}
