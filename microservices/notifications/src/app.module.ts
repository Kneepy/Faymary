import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notificaiton } from "./notification.entity";
import {
    MODULE_PACKAGE_NAME,
    MYSQL_HOST,
    MYSQL_PASS,
    MYSQL_PORT,
    MYSQL_USER
} from "./notifications.constants";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            username: MYSQL_USER,
            password: MYSQL_PASS,
            database: MODULE_PACKAGE_NAME,
            entities: [Notificaiton],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Notificaiton])
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
