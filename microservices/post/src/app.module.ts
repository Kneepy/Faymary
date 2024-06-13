import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./entities";
import { PostsController } from "./post.controller";
import { PostsService } from "./post.service";
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
            entities: [Posts],
            synchronize: false
        }),
        TypeOrmModule.forFeature([Posts])
    ],
    controllers: [PostsController],
    providers: [PostsService]
})
export class AppModule {}
