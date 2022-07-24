import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth";
import { MySqlModule } from "src/mysql";
import * as controllers from "./controllers";

@Module({
    imports: [MySqlModule, AuthModule],
    controllers: [...Object.values(controllers)]
})
export class BaseModule {}
