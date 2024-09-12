import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Mark } from "./mark.entity";

@Entity()
export class Story {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    user_id: string;

    @Column({ type: "bigint" })
    createdAt: number;

    @Column()
    file_id: string;

    @OneToMany(() => Mark, (marks: Mark) => marks.story, { cascade: true })
    marks: Mark[];
}
