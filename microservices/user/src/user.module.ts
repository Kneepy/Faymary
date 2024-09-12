import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { DB, DB_HOST, DB_PASSWORD, DB_PORT, DB_TYPE, DB_USERNAME } from "./constants";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST, // для контейнера docker нужно менять на соответсвующий хотст (mysql)
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [Users],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Users])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class AppModule {}
