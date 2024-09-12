import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    DB,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_TYPE,
    DB_USERNAME,
    DialogHistory,
    DialogParticipants,
    Dialogs,
} from "./common";
import { DialogsController } from "./dialogs.controller";
import { DialogsService } from "./dialogs.service";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [DialogHistory, Dialogs, DialogParticipants],
            synchronize: true
        }),
        TypeOrmModule.forFeature([DialogHistory, Dialogs, DialogParticipants])
    ],
    controllers: [DialogsController],
    providers: [DialogsService]
})
export class AppModule {}
