import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    MODULE_PACKAGE_NAME,
    MYSQL_HOST,
    MYSQL_PASS,
    MYSQL_PORT,
    MYSQL_USER,
    Notifications
} from "./common";
import { NotificationService } from "./providers";
import { NotificationController } from "./controllers";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            username: MYSQL_USER,
            password: MYSQL_PASS,
            database: MODULE_PACKAGE_NAME,
            entities: [Notifications],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Notifications])
    ],
    controllers: [NotificationController],
    providers: [NotificationService]
})
export class AppModule {}
