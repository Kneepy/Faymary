import { MessagesController } from './messages.controller';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    DB,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_TYPE,
    DB_USERNAME,
    Messages,
    REDIS_PASS,
    REDIS_URL,
    REDIS_USER
} from "./common";
import { MessagesService } from "./messages.service";
import { RedisModule } from './redis';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [Messages],
            synchronize: false
        }),
        TypeOrmModule.forFeature([Messages]),
        RedisModule.forRoot({
            url: REDIS_URL,
            username: REDIS_USER,
            password: REDIS_PASS,
        })
    ],
    providers: [MessagesService],
    controllers: [MessagesController]
})
export class AppModule {}
