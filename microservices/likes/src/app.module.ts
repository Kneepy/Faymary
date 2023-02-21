import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    Likes,
    MODULE_PACKAGE_NAME,
    MYSQL_HOST,
    MYSQL_PASS,
    MYSQL_PORT,
    MYSQL_USER,
} from "./common";
import {LikesService} from "./providers";
import {LikesController} from "./controllers";
import { Broker } from "./borker.interceptor";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            username: MYSQL_USER,
            password: MYSQL_PASS,
            database: MODULE_PACKAGE_NAME,
            entities: [Likes],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Likes])
    ],
    controllers: [LikesController],
    providers: [LikesService, Broker]
})
export class AppModule {}
