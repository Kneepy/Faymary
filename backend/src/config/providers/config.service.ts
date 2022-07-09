import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class ConfigService {
    getMySqlConnectionData(): TypeOrmModuleOptions {
        return {
            type: "mysql",
            host: "127.0.0.1",
            port: 3306,
            username: "root",
            password: "root",
            database: "social_network",
            synchronize: true,
            entities: ["dist/**/*.entity{.ts, .js}"],
        };
    }
}
