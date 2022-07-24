import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt";
import {
    EXPIRENS_IN_ACCESS_TOKEN,
    EXPIRENS_IN_REFRESH_TOKEN,
    SECRET_ACCESS_JWT,
    SECRET_REFRESH_JWT,
} from "../config.constants";

@Injectable()
export class ConfigService {
    getMySqlConnectionData = (): TypeOrmModuleOptions => ({
        type: "mysql",
        host: "127.0.0.1",
        port: 3306,
        username: "root",
        password: "root",
        database: "social_network",
        synchronize: false,
        entities: ["dist/**/*.entity{.ts,.js}"],
    });

    // access token options
    getJwtOptions = (): JwtModuleOptions => ({
        secret: SECRET_ACCESS_JWT,
        signOptions: { expiresIn: EXPIRENS_IN_ACCESS_TOKEN },
    });

    // refresh token options
    getJwtRefreshTokenOptions = (): JwtSignOptions => ({
        secret: SECRET_REFRESH_JWT,
        expiresIn: EXPIRENS_IN_REFRESH_TOKEN,
    });
}
