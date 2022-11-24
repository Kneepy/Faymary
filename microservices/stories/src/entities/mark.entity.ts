import { MarkEnumType } from "src/mark.enum";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Story } from "./story.enitity";

@Entity()
export class Mark {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    type: MarkEnumType

    @Column()
    item_id: string

    @ManyToOne(() => Story, (story: Story) => story.marks)
    story: Story
}