import { Module } from "@nestjs/common";
import { MySqlModule } from "./mysql/mysql.module";
import { CommonModule } from "./common";

@Module({
    imports: [MySqlModule, CommonModule],
})
export class AppModule {}
