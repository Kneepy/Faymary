import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    Comments,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_TYPE,
    DB_USERNAME,
    MODULE_PACKAGE_NAME,
} from "./common";
import {CommentsController} from "./controllers/comments.controller";
import {CommentsService} from "./providers";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: MODULE_PACKAGE_NAME,
            entities: [Comments],
            synchronize: false
        }),
        TypeOrmModule.forFeature([Comments])
    ],
    controllers: [CommentsController],
    providers: [CommentsService]
})
export class AppModule {}
