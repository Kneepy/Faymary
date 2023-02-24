import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    Messages,
    MODULE_PACKAGE_NAME,
    MYSQL_HOST,
    MYSQL_PASS,
    MYSQL_PORT,
    MYSQL_USER
} from "./common";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            username: MYSQL_USER,
            password: MYSQL_PASS,
            database: MODULE_PACKAGE_NAME,
            entities: [Messages],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Messages])
    ]
})
export class AppModule {}
