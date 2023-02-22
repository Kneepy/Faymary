import { Module } from '@nestjs/common';
import {LikesController} from "./controllers/likes.controller";
import {LikesClient} from "./clients/likes.client";
import {ClientGrpc, ClientsModule} from "@nestjs/microservices";
import {getClientOptionsByConfig, LIKES_MODULE_CONFIG} from "./app.constants";
import {LikesServiceClient} from "./proto/likes";

@Module({
    imports: [
        ClientsModule.register([{name: "LIKES_PACKAGE", ...getClientOptionsByConfig(LIKES_MODULE_CONFIG)}])
    ],
    controllers: [LikesController],
    providers: [LikesClient, {
        inject: [{token: "LIKES_PACKAGE", optional: false}],
        useFactory: (likesPackage: ClientGrpc) => {
            return likesPackage.getService<LikesServiceClient>(LIKES_MODULE_CONFIG.SERVICE)
        },
        provide: "LIKES_SERVICE"
    }],
})
export class AppModule {}
