import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attachments } from "./attachments.entity";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToMany(() => Attachments, (attachments: Attachments) => attachments.message, {cascade: true})
    attachments: Attachments[];

    @Column()
    dialog_id: string;

    @Column()
    user_id: string;

    @Column()
    msg: string;

    @Column({ type: "bigint" })
    createdAt: number;
}
