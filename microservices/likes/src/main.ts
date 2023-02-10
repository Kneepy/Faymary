import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { MODULE_PACKAGE_NAME, DIALOG_PROTO_PATH } from "./common";

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                package: MODULE_PACKAGE_NAME,
                protoPath: DIALOG_PROTO_PATH
            }
        }
    );
    await app.listen();
})();
