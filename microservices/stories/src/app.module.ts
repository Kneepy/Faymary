import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
    DB,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_TYPE,
    DB_USERNAME,
} from "./constants";
import { StoriesController } from "./controllers";
import { Mark, Story } from "./entities";
import { StoriesService } from "./providers";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST,
            port: (() => {
                console.log(DB_PORT)
                return DB_PORT
            })(),
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [Story, Mark],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Story, Mark])
    ],
    providers: [StoriesService],
    controllers: [StoriesController]
})
export class AppModule {}
