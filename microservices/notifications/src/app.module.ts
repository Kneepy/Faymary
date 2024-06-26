import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    DB,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_TYPE,
    DB_USERNAME,
    Notifications
} from "./common";
import { NotificationService } from "./providers";
import { NotificationController } from "./controllers";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [Notifications],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Notifications])
    ],
    controllers: [NotificationController],
    providers: [NotificationService]
})
export class AppModule {}
