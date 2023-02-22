import { Module } from '@nestjs/common';
import {LikesController} from "./controllers/likes.controller";
import {LikesClient} from "./clients/likes.client";

@Module({
    imports: [],
    controllers: [LikesController],
    providers: [LikesClient],
})
export class AppModule {}
