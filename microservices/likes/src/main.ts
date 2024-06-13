import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import {MODULE_PACKAGE_NAME, MODULE_HOST, LIKES_PROTO_PATH} from "./common";
import {Logger} from "@nestjs/common"

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                package: MODULE_PACKAGE_NAME,
                protoPath: LIKES_PROTO_PATH,
                url: MODULE_HOST,
                loader: {
                    keepCase: true
                }
            }
        }
    );

    await app.listen();
    Logger.log("Likes service successfully started")
})();
