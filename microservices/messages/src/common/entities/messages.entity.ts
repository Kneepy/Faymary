import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MessagesEnumType } from "../enums";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: true})
    attachment: MessagesEnumType;

    @Column({nullable: true})
    item_id: string;

    @Column()
    dialog_id: string;

    @Column()
    user_id: string;

    @Column()
    msg: string;

    @Column({ type: "bigint" })
    createdAt: number;
}
