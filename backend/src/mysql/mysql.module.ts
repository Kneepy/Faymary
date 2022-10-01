import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "src/config/providers/config.service";
import { ConfigModule } from "src/config/config.module";
import * as allMySQLProviders from "./providers";
import {
    Users,
    Sessions,
    Confirmations,
    Activity,
    Notifications,
    UserSettings,
    Posts,
    Comments,
    Files,
    Messages,
    Dialogs,
    DialogUserRelationships,
} from "src/entity";

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
            Notifications,
            UserSettings,
            Posts,
            Comments,
            Files,
            Messages,
            Dialogs,
            DialogUserRelationships
        ])
    ],
    providers: providers,
    exports: providers
})
export class MySqlModule {}
