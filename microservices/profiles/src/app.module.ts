import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { Accounts, MODULE_PACKAGE_NAME, MYSQL_HOST, MYSQL_PASS, MYSQL_PORT, MYSQL_USER, Profiles } from './common';
import { ProfilesController } from './profiles.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            username: MYSQL_USER,
            password: MYSQL_PASS,
            database: MODULE_PACKAGE_NAME,
            entities: [Accounts, Profiles],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Accounts, Profiles])
    ],
    providers: [ProfilesService],
    controllers: [ProfilesController]
})
export class AppModule {}