import { Module } from "@nestjs/common";
import { MySqlModule } from "./mysql/mysql.module";
import { CommonModule } from "./common/common.module";
import { BaseModule } from "./base/base.module";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [MySqlModule, CommonModule, AuthModule, BaseModule, ConfigModule]
})
export class AppModule {}
