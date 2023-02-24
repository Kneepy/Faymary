import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { NotificationEnumType } from "../enums";

@Entity()
export class Notifications {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    type: NotificationEnumType;

    @Column()
    item_id: string;

    @Column()
    to_id: string;

    @Column()
    from_id: string;

    @Column({ type: "bigint" })
    createdAt: number;
}
