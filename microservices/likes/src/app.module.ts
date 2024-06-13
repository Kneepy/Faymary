import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    DB,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_TYPE,
    DB_USERNAME,
    Likes,
} from "./common";
import {LikesService} from "./providers";
import {LikesController} from "./controllers";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [Likes],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Likes])
    ],
    controllers: [LikesController],
    providers: [LikesService]
})
export class AppModule {}
