import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModuleOptions } from "@nestjs/jwt";
import {
    EXPIRENS_IN_ACCESS_TOKEN,
    SECRET_ACCESS_JWT,
    SMTP,
    STORE_FOLDER
} from "../config.constants";
import { MailerModuleOptions } from "@lib/mailer";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import path from "path";

@Injectable()
export class ConfigService {
    // mailer connaction data
    getMailerOptions = (): MailerModuleOptions => ({
        host: SMTP.HOST,
        port: SMTP.PORT,
        secure: true,
        auth: {
            user: SMTP.USER,
            pass: SMTP.PASS
        }
    });

    getStaticOptions = () => ([{
        rootPath: "fefwfwf"
    }])

    getMulterOptions = (): MulterOptions => ({
        dest: path.join(process.cwd(), STORE_FOLDER)
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
