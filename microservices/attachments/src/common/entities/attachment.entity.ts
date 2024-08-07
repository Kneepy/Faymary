import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AttachmentType } from "../enums";

@Entity()
export class Attachment {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    parent_id: string

    @Column()
    attached_id: string

    @Column()
    type: AttachmentType
}