import { Module, forwardRef } from "@nestjs/common";
import { MySqlModule } from "./mysql/mysql.module";
import { CommonModule } from "./common";
import { BaseModule } from "./base";
import { ConfigModule } from "./config";

@Module({
    imports: [MySqlModule, CommonModule, BaseModule, ConfigModule],
})
export class AppModule {}
