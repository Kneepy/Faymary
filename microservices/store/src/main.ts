import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { StoreModule } from "./store.module";
import { STORE_PACKAGE_NAME, STORE_PROTO_PATH } from "./store.constants";
import { Logger } from "@nestjs/common";

(async () => {
    const app = await NestFactory.create(StoreModule)

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: STORE_PACKAGE_NAME,
            protoPath: STORE_PROTO_PATH  
        }
    })
    await app.startAllMicroservices();
    await app.listen(3000, async () => Logger.log(`Serve start on: ${await app.getUrl()}`))
})()
