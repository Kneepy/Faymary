import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { StoreModule } from "./store.module";
import { MODULE_HOST, STORE_PACKAGE_NAME, STORE_PROTO_PATH } from "./constants/store.constants";
import { Logger } from "@nestjs/common";
import { middlware } from "./app.middleware";

(async () => {
    const app = await NestFactory.create(StoreModule)

    middlware(app)
    
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: STORE_PACKAGE_NAME,
            protoPath: STORE_PROTO_PATH,
            url: MODULE_HOST
        }
    })
    await app.startAllMicroservices();
    await app.listen(3000, async () => Logger.log(`Serve start on: ${await app.getUrl()}`))
})()
