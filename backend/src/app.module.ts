import { Module } from "@nestjs/common";
import { MySqlModule } from "./mysql/mysql.module";
import { CommonModule } from "./common/common.module";
import { BaseModule } from "./base/base.module";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth";

@Module({
    imports: [
        MySqlModule,
        CommonModule,
        AuthModule,
        BaseModule,
        ConfigModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useExisting: AuthGuard
        }
    ]
})
export class AppModule {}
