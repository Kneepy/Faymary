import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "src/config/providers/config.service";
import { ConfigModule } from "src/config/config.module";
import { Users, Files, Dialogs, Messages } from "src/entity";
import * as allMySQLProviders from "./providers";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) =>
                configService.getMySqlConnectionData(),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Users, Files, Dialogs, Messages]),
    ],
    providers: [...Object.values(allMySQLProviders)],
})
export class MySqlModule {}
