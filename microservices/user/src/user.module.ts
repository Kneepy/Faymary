import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "root",
            database: "user",
            entities: [Users],
            synchronize: false
        }),
        TypeOrmModule.forFeature([Users])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class AppModule {}
