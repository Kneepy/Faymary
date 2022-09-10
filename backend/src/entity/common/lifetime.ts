import { Column } from "typeorm";

export class Lifetime {
    @Column({
        nullable: false,
        type: "bigint"
    })
    expirensIn: number;

    @Column({ nullable: false, type: "bigint" })
    createdAt: number;
}
