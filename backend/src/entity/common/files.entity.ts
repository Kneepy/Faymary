import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users";

@Entity()
export class Files {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: false, type: "bigint" })
    createdAt: number;

    @ManyToOne(() => Users, (user: Users) => user.files)
    @JoinColumn()
    user: Users

    @Column()
    path: string
}