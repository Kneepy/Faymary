import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AccessCodes {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    createdAt: number

    @Column()
    code: number

    @Column()
    user_id: string
}