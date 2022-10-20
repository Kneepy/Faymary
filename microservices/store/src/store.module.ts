import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { File } from "./entities";
import { StoreController } from "./store.controller";
import { StoreService } from "./store.service";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "root",
            database: "store",
            entities: [File],
            synchronize: true
        }),
        TypeOrmModule.forFeature([File])
    ],
    controllers: [StoreController],
    providers: [StoreService]
})
export class StoreModule {}
