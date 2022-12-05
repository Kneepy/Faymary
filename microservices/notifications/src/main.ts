import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import {
    NOTIFICATION_PROTO_PATH,
    MODULE_PACKAGE_NAME
} from "./notifications.constants";

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                package: MODULE_PACKAGE_NAME,
                protoPath: NOTIFICATION_PROTO_PATH
            }
        }
    );
    await app.listen();
})();
