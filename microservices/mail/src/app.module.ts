import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessCodes } from './access-codes.entity';
import { MODULE_PACKAGE_NAME, MYSQL_HOST, MYSQL_PASS, MYSQL_PORT, MYSQL_USER, MYSQL_DB } from './constants';
import { MailController } from './mail.controller';
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
        database: MYSQL_DB,
        entities: [AccessCodes],
        synchronize: false
      }),
      TypeOrmModule.forFeature([AccessCodes])
    ],
    controllers: [MailController],
    providers: [AccessCodesService, MailerService],
})
export class AppModule {}
