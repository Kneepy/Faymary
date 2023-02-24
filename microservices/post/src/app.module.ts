import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "./entities";
import { PostsController } from "./post.controller";
import { PostsService } from "./post.service";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "root",
            database: "posts",
            entities: [Posts],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Posts])
    ],
    controllers: [PostsController],
    providers: [PostsService]
})
export class AppModule {}
