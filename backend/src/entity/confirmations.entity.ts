import { EXPIRES_IN_CONFORMATION } from "src/config";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Confirmations {
    @PrimaryGeneratedColumn("rowid")
    id: string

    @Column({nullable: false})
    code: string

    @Column({
        nullable: false,
        type: "bigint",
        default: Date.now() + EXPIRES_IN_CONFORMATION
    })
    expirensIn: number;

    @Column({ nullable: false, type: "bigint", default: Date.now() })
    createdAt: number;
}