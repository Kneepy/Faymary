import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { MODULE_PACKAGE_NAME, POST_PROTO_PATH } from "./constants";

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: MODULE_PACKAGE_NAME,
            protoPath: POST_PROTO_PATH  
        }
    })
    await app.listen();
})()
