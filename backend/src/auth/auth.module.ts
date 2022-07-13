import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "src/config";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => configService.getJwtOptions(),
            inject: [ConfigService]
        })
    ]
})
export class AuthModule {}