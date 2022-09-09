import { Module } from "@nestjs/common";
import { MySqlModule } from "./mysql/mysql.module";
import { CommonModule } from "./common/common.module";
import { BaseModule } from "./base/base.module";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthGuard } from "./auth";
import { ConfigService } from "./config";

@Module({
    imports: [
        MySqlModule, CommonModule, AuthModule, BaseModule, ConfigModule,
        ServeStaticModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => configService.getStaticOptions(),
            inject: [ConfigService]
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useExisting: AuthGuard
        }
    ]
})
export class AppModule {}
