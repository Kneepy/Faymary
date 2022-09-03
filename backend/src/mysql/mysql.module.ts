import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "src/config/providers/config.service";
import { ConfigModule } from "src/config/config.module";
import * as allMySQLProviders from "./providers";
import { Users } from "src/entity/users.entity";
import { Sessions } from "src/entity/sessions.entity";
import { Confirmations } from "src/entity/confirmations.entity";
import { Activity } from "src/entity/activity.entity";
import { Notifications } from "src/entity/notifications.entity";

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
