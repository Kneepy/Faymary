import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class File {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false, type: "bigint" })
    createdAt: number;

    @Column()
    user_id: string;

    @Column()
    filename: string // "exapmle"

    @Column()
    extname: string // ".mp3"
}