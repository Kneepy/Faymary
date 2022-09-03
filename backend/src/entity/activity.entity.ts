import { ActivityEnum } from "src/mysql";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Activity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    state: ActivityEnum

    @Column({
        nullable: false,
        type: "bigint",
        default: Date.now()
    })
    start: number

    @Column({
        nullable: true,
        type: "bigint"
    })
    end: number

    @OneToOne(() => Users, (user: Users) => user.activity)
    user: Users
}