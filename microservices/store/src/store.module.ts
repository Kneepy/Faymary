import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { File } from "./entities";
import { StoreController } from "./store.controller";
import { StoreResource } from "./providers";
import { MulterModule } from "@nestjs/platform-express";
import { GetMulterConfig } from "./multer.config";
import { UserExistHttp } from "./user-exist.guard";
import { DB, DB_HOST, DB_PASSWORD, DB_PORT, DB_TYPE, DB_USERNAME } from "./constants";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [File],
            synchronize: true
        }),
        TypeOrmModule.forFeature([File]),
        MulterModule.registerAsync({
            useFactory: () => GetMulterConfig()
        })
    ],
    controllers: [StoreController],
    providers: [StoreResource, UserExistHttp]
})
export class StoreModule {}
