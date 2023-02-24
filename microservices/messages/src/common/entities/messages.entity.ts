import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MessagesEnumType } from "../enums";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    attachment: MessagesEnumType;

    @Column()
    item_id: string;

    @Column()
    dialog_id: string;

    @Column()
    user_id: string;

    @Column()
    message: string;

    @Column({ type: "bigint" })
    createdAt: number;
}
