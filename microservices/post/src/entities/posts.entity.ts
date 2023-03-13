import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
    @PrimaryGeneratedColumn("uuid")
    id: string 

    @Column({nullable: false})
    user_id: string 

    @Column({ nullable: false, type: "bigint" })
    createdAt: number

    @Column({nullable: true})
    file_ids: string

    @Column({nullable: false})
    msg: string
}