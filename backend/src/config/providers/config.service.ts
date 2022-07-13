import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModuleOptions } from "@nestjs/jwt"
import { SECRET_JWT } from "../config.constants";

@Injectable()
export class ConfigService {
    getMySqlConnectionData = (): TypeOrmModuleOptions => ({
        type: "mysql",
        host: "127.0.0.1",
        port: 3306,
        username: "root",
        password: "root",
        database: "social_network",
        synchronize: true,
        entities: ["dist/**/*.entity{.ts, .js}"],
    })

    getJwtOptions = (): JwtModuleOptions => ({
        secret: SECRET_JWT,
        signOptions: {expiresIn: "14d"}
    })
}
