import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MAIL_PROTO_PATH, MODULE_HOST, MODULE_PACKAGE_NAME } from './constants';
import { AppModule } from './app.module';

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: MODULE_PACKAGE_NAME,
            protoPath: MAIL_PROTO_PATH,
            url: MODULE_HOST,
            loader: {
              keepCase: true
            }
        }
    })
    await app.listen()
})()
