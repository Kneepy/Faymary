import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class Files {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user: Users) => user.files)
    user: Users;
}
