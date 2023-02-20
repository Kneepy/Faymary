import { Module } from '@nestjs/common';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {LIKES_MODULE, LIKES_MODULE_HOST, LIKES_MODULE_PKG, LIKES_MODULE_PROTO} from './app.constants';
import {LikesController} from "./controllers/likes.controller";
import {LikesClient} from "./clients/likes.client";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: LIKES_MODULE,
                transport: Transport.GRPC,
                options: {
                    url: LIKES_MODULE_HOST,
                    package: LIKES_MODULE_PKG,
                    protoPath: LIKES_MODULE_PROTO,
                    loader: {
                        keepCase: true
                    }
                }
            }
        ])
  ],
  controllers: [LikesController],
  providers: [LikesClient],
})
export class AppModule {}
