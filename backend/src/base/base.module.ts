import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth";
import { MailerModule } from "@lib/mailer";
import { MySqlModule } from "src/mysql";
import * as controllers from "./controllers";
import { ConfigService, ConfigModule } from "src/config";

@Module({
    imports: [
        MySqlModule, AuthModule, 
        MailerModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.getMailerOptions() 
        })
    ],
    controllers: [...Object.values(controllers)]
})
export class BaseModule {}
