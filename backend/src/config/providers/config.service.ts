import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt"
import { SECRET_JWT, SECRET_REFRESH_JWT } from "../config.constants";

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
        signOptions: {expiresIn: "900000ms"} // 15min
    })

    getJwtRefreshTokenOptions = (): JwtSignOptions => ({
        secret: SECRET_REFRESH_JWT,
        expiresIn: "14d"
    })
}
