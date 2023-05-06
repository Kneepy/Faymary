import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { File } from "./entities";
import { StoreController } from "./store.controller";
import { StoreResource } from "./providers";
import { MulterModule } from "@nestjs/platform-express";
import { GetMulterConfig } from "./multer.config";
import { UserExistHttp } from "./user-exist.guard";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "root",
            database: "store",
            entities: [File],
            synchronize: false
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
