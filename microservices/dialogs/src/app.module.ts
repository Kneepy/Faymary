import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    DialogHistory,
    DialogParticipants,
    Dialogs,
    MODULE_PACKAGE_NAME,
    MYSQL_HOST,
    MYSQL_PASS,
    MYSQL_PORT,
    MYSQL_USER,
} from "./common";
import { DialogsController } from "./dialogs.controller";
import { DialogsService } from "./dialogs.service";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            username: MYSQL_USER,
            password: MYSQL_PASS,
            database: MODULE_PACKAGE_NAME,
            entities: [DialogHistory, Dialogs, DialogParticipants],
            synchronize: true
        }),
        TypeOrmModule.forFeature([DialogHistory, Dialogs, DialogParticipants])
    ],
    controllers: [DialogsController],
    providers: [DialogsService]
})
export class AppModule {}
