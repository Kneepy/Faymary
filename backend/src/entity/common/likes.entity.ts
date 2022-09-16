import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users";

@Entity()
export class Likes {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @OneToOne(() => Users)
    @JoinColumn()
    user: Users
}