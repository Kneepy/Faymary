import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { MODULE_HOST, MODULE_PACKAGE_NAME, NOTIFICATION_PROTO_PATH } from "./common";

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                package: MODULE_PACKAGE_NAME,
                protoPath: NOTIFICATION_PROTO_PATH,
                url: MODULE_HOST,
                loader: {
                    keepCase: true
                }
            }
        }
    );
    await app.listen();
})();
