import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    DB_TYPE,
    DialogHistory,
    DialogParticipants,
    Dialogs,
    MODULE_PACKAGE_NAME,
    POSTGRES_HOST,
    POSTGRES_PASS,
    POSTGRES_PORT,
    POSTGRES_USER,
} from "./common";
import { DialogsController } from "./dialogs.controller";
import { DialogsService } from "./dialogs.service";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: POSTGRES_HOST,
            port: POSTGRES_PORT,
            username: POSTGRES_USER,
            password: POSTGRES_PASS,
            database: MODULE_PACKAGE_NAME,
            entities: [DialogHistory, Dialogs, DialogParticipants],
            synchronize: false
        }),
        TypeOrmModule.forFeature([DialogHistory, Dialogs, DialogParticipants])
    ],
    controllers: [DialogsController],
    providers: [DialogsService]
})
export class AppModule {}
