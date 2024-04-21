import { MessagesController } from './messages.controller';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    DB_TYPE,
    Messages,
    MODULE_PACKAGE_NAME,
    POSTGRES_HOST,
    POSTGRES_PASS,
    POSTGRES_PORT,
    POSTGRES_USER,
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
            host: POSTGRES_HOST,
            port: POSTGRES_PORT,
            username: POSTGRES_USER,
            password: POSTGRES_PASS,
            database: MODULE_PACKAGE_NAME,
            entities: [Messages],
            synchronize: true
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
