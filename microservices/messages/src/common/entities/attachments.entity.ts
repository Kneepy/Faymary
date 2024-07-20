import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Messages } from "./messages.entity";
import { AttachmentType } from "../enums";

@Entity()
export class Attachments {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => Messages, (message: Messages) => message.attachments)
    @JoinColumn()
    message: Messages

    @Column({ nullable: false })
    type: AttachmentType

    @Column({ nullable: false })
    item_id: string
}