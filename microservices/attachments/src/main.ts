import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from "@nestjs/common";
import { DIALOG_PROTO_PATH, MODULE_HOST, MODULE_PACKAGE_NAME } from "./common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                package: MODULE_PACKAGE_NAME,
                protoPath: DIALOG_PROTO_PATH,
                url: MODULE_HOST,
                loader: {
                    keepCase: true
                }
            }
        }
    );
    await app.listen();
    Logger.log("Attachments service successfully started")
})()
