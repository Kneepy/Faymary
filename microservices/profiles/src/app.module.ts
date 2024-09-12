import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { Accounts, DB, DB_HOST, DB_PASSWORD, DB_PORT, DB_TYPE, DB_USERNAME, Profiles } from './common';
import { ProfilesController } from './profiles.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [Accounts, Profiles],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Accounts, Profiles])
    ],
    providers: [ProfilesService],
    controllers: [ProfilesController]
})
export class AppModule {}