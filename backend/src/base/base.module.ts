import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth";
import { MailerModule } from "@lib/mailer";
import { MySqlModule } from "src/mysql";
import * as Controllers from "./controllers";
import * as Gateways from "./gateways";
import { ConfigService, ConfigModule } from "src/config";

const AllGateways = Object.values(Gateways)
const AllControllers = Object.values(Controllers)

@Module({
    imports: [
        MailerModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) =>
                configService.getMailerOptions(),
            inject: [ConfigService]
        }),
        MySqlModule,
        AuthModule
    ],
    providers: AllGateways,
    controllers: AllControllers
})
export class BaseModule {}
