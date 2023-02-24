import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessCodes } from './access-codes.entity';
import { MODULE_PACKAGE_NAME, MYSQL_HOST, MYSQL_PASS, MYSQL_PORT, MYSQL_USER } from './app.constants';
import { AppController } from './app.controller';
import { AccessCodesService } from './providers';
import { MailerService } from './providers/mailer.service';

@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: "mysql",
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        username: MYSQL_USER,
        password: MYSQL_PASS,
        database: MODULE_PACKAGE_NAME,
        entities: [AccessCodes],
        synchronize: true
      }),
      TypeOrmModule.forFeature([AccessCodes])
    ],
    controllers: [AppController],
    providers: [AccessCodesService, MailerService],
})
export class AppModule {}
