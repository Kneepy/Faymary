import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import {MODULE_HOST, SESSION_PACKAGE_NAME, SESSION_PROTO_PATH } from "./constants";
import { AuthModule } from "./auth.module";

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
        transport: Transport.GRPC,
        options: {
            package: SESSION_PACKAGE_NAME,
            protoPath: SESSION_PROTO_PATH,
            url: MODULE_HOST,
            loader: {
                keepCase: true
            }
        }
    })

    await app.listen();
})()
