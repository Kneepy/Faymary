import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Files, Lifetime } from "../common";
import { Users } from "../users";

@Entity()
export class Story extends Lifetime {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToMany(() => File)
    file: Files

    @ManyToOne(() => Users)
    user: Users

    @ManyToMany(() => Users)
    likes: Users[]

    @ManyToMany(() => Story)
    references: Story[]
}