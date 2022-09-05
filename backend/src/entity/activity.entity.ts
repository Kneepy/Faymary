import { ActivityEnum } from "src/mysql";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Activity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    state: ActivityEnum;

    @Column({
        nullable: false,
        type: "bigint"
    })
    start: number;

    @Column({
        nullable: true,
        type: "bigint"
    })
    end: number;

    @OneToOne(() => Users, (user: Users) => user.activity)
    @JoinColumn()
    user: Users;
}
