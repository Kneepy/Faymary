import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { NotificationAdditionsEnumType, NotificationEnumType } from "../enums";

@Entity()
export class Notifications {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * id элемента который добавили к какой либо записи
    */
    @Column()
    item_id: string;

    /**
     * тип элемента который добавили к какой либо записи
    */
    @Column()
    type: NotificationAdditionsEnumType;

    /**
     * id элемента к которому добавили какую либо запись
    */
    @Column()
    parent_id: string

    /**
     * тип элемента к которому добавили какую либо запись
    */
    @Column()
    parent_type: NotificationAdditionsEnumType

    @Column()
    notification_type: NotificationEnumType

    @Column()
    to_id: string;

    @Column()
    from_id: string;

    @Column({ type: "bigint" })
    createdAt: number;
}
