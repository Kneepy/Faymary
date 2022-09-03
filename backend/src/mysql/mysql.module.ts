import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "src/config/providers/config.service";
import { ConfigModule } from "src/config/config.module";
import {
    Users,
    Sessions,
    Confirmations,
    Activity,
    Notifications
} from "src/entity";
import * as allMySQLProviders from "./providers";

const providers = [...Object.values(allMySQLProviders)];

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) =>
                configService.getMySqlConnectionData(),
            inject: [ConfigService]
        }),
        TypeOrmModule.forFeature([
            Users,
            Sessions,
            Confirmations,
            Activity,
            Notifications
        ])
    ],
    providers: providers,
    exports: providers
})
export class MySqlModule {}
