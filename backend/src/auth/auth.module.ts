import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "src/config";
import { MySqlModule } from "src/mysql/mysql.module";
import { AuthService } from "./services/auth.service";
import * as AllGuards from "./guards";

const guards = Object.values(AllGuards);

@Module({
    imports: [
        MySqlModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) =>
                configService.getJwtOptions(),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService, ...guards],
    exports: [AuthService, ...guards]
})
export class AuthModule {}
