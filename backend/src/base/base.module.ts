import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth";
import { MailerModule } from "@lib/mailer";
import { MySqlModule } from "src/mysql";
import * as controllers from "./controllers";
import { ConfigService } from "src/config";

@Module({
    imports: [
        MailerModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.getMailerOptions() 
        }),
        MySqlModule, AuthModule
    ],
    controllers: [...Object.values(controllers)]
})
export class BaseModule {}
