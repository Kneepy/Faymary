import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    dialog_id: string;

    @Column()
    user_id: string;

    @Column()
    msg: string;

    @Column({ type: "bigint" })
    createdAt: number;

    @Column({ default: false })
    has_attachments: boolean
}
