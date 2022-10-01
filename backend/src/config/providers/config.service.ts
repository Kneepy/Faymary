import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModuleOptions } from "@nestjs/jwt";
import {
    EXPIRENS_IN_ACCESS_TOKEN,
    EXPIRENS_IN_REFRESH_TOKEN,
    SECRET_ACCESS_JWT,
    SMTP,
    STORE_FOLDER
} from "../config.constants";
import { MailerModuleOptions } from "@lib/mailer";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as path from "path";
import * as multer from "multer";
import { ICustomRequest } from "src/common/types/request.type";

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

    getStaticOptions = () => [
        {
            rootPath: path.join(process.cwd(), STORE_FOLDER)
        }
    ];

    getMulterOptions = (): MulterOptions => ({
        dest: path.join(process.cwd(), STORE_FOLDER),
        storage: multer.diskStorage({
            destination: (req: ICustomRequest, file, cb) => {
                cb(null, this.getStaticOptions()[0].rootPath);
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + path.extname(file.originalname));
            }
        })
    });

    getCookieOptions = () => ({
        // prodaction all true
        httpOnly: true,
        secure: false,
        maxAge: EXPIRENS_IN_REFRESH_TOKEN
    });

    // mysql connaction data
    getMySqlConnectionData = (): TypeOrmModuleOptions => ({
        type: "mysql",
        host: "127.0.0.1",
        port: 3306,
        username: "root",
        password: "root",
        database: "faymary",
        synchronize: true,
        entities: ["dist/**/*.entity{.ts,.js}"]
    });

    // access token options
    getJwtOptions = (): JwtModuleOptions => ({
        secret: SECRET_ACCESS_JWT,
        signOptions: { expiresIn: EXPIRENS_IN_ACCESS_TOKEN }
    });
}
