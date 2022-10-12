import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    userName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
    password: string;

    @ManyToMany(() => Users, (users: Users) => users.subscriptions)
    followers: Users[]

    @ManyToMany(() => Users, (users: Users) => users.followers) 
    subscriptions: Users[]
}
