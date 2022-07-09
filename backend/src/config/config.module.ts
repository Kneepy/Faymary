import { Module } from "@nestjs/common";
import { ConfigService } from "./providers/config.service";

@Module({
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}
