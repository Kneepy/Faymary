import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "src/config";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => configService.getJwtOptions(),
            inject: [ConfigService]
        }), 
        ConfigModule
    ],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}