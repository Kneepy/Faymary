import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users";

@Entity()
export class Likes {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Users)
    @JoinColumn()
    user: Users;
}
