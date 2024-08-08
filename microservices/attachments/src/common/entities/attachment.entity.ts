import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AttachmentType } from "../enums";

@Entity()
export class Attachment {
    @PrimaryGeneratedColumn("uuid")
    id: string

    /**
     * Вообще тут можно было и без типа родителя т.к uuid даёт относительно большую униквльность
     * Но она работает хорошо только в пределах одной БД поэтому при большом количесвте вложений
     * Есть маленькая вероятность что появятся одинаковые uuid
     */
    @Column()
    parent_type: AttachmentType

    /**
     * ID элемента для которого создаётся вложение
     */
    @Column()
    parent_id: string

    /**
     * ID элемента который будет являться вложением
     */
    @Column()
    attached_id: string

    @Column()
    attached_type: AttachmentType

}