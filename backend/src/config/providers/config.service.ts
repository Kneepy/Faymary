import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModuleOptions } from "@nestjs/jwt";
import {
    EXPIRENS_IN_ACCESS_TOKEN,
    MAIL_ACCOUNT_PASS,
    MAIL_ACCOUNT_USER,
    MAIL_HOST,
    MAIL_PORT,
    SECRET_ACCESS_JWT
} from "../config.constants";
import { MailerModuleOptions } from "@lib/mailer";

@Injectable()
export class ConfigService {

    // mailer connaction data
    getMailerOptions = (): MailerModuleOptions => ({
        service: MAIL_HOST,
        host: MAIL_HOST,
        port: MAIL_PORT,
        secure: true,
        auth: {
            user: MAIL_ACCOUNT_USER,
            pass: MAIL_ACCOUNT_PASS
        }
    })

    // mysql connaction data
    getMySqlConnectionData = (): TypeOrmModuleOptions => ({
        type: "mysql",
        host: "127.0.0.1",
        port: 3306,
        username: "root",
        password: "root",
        database: "faymary",
        synchronize: false,
        entities: ["dist/**/*.entity{.ts,.js}"]
    });

    // access token options
    getJwtOptions = (): JwtModuleOptions => ({
        secret: SECRET_ACCESS_JWT,
        signOptions: { expiresIn: EXPIRENS_IN_ACCESS_TOKEN }
    });
}
