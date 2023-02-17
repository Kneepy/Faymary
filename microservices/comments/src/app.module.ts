import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    Comments,
    MODULE_PACKAGE_NAME,
    MYSQL_HOST,
    MYSQL_PASS,
    MYSQL_PORT,
    MYSQL_USER,
} from "./common";
import {CommentsController} from "./controllers/comments.controller";
import {CommentsService} from "./providers";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            username: MYSQL_USER,
            password: MYSQL_PASS,
            database: MODULE_PACKAGE_NAME,
            entities: [],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Comments])
    ],
    controllers: [CommentsController],
    providers: [CommentsService]
})
export class AppModule {}
