import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "root",
            database: "store",
            entities: [],
            synchronize: true
        }),
        TypeOrmModule.forFeature([])
    ],
    controllers: [],
    providers: []
})
export class StoreModule {}
