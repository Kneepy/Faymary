import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MODULE_PACKAGE_NAME, MYSQL_HOST, MYSQL_PASS, MYSQL_PORT, MYSQL_USER } from "./constants";
import { Mark, Story } from "./entities";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            username: MYSQL_USER,
            password: MYSQL_PASS,
            database: MODULE_PACKAGE_NAME,
            entities: [Story, Mark],
            synchronize: true
        })
    ],
    providers: [],
    controllers: []
})
export class AppModule {}