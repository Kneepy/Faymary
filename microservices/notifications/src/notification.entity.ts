import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Notificaiton {
    @PrimaryGeneratedColumn("uuid")
    id: string

    
}