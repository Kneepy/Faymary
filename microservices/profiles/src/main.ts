import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from "@nestjs/common"
import { AppModule } from './app.module';
import { MODULE_PACKAGE_NAME, PROFILES_PROTO_PATH, MODULE_HOST } from './common/constants/app.constants';

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: MODULE_PACKAGE_NAME,
            protoPath: PROFILES_PROTO_PATH,
            url: MODULE_HOST,
            loader: {
                keepCase: true
            }
        }
    });
    await app.listen();

    Logger.log("Profiles service successfully started")
})()
