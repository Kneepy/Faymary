import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessCodes } from './access-codes.entity';
import { DB_TYPE, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB } from './constants';
import { MailController } from './mail.controller';
import { AccessCodesService } from './providers';
import { MailerService } from './providers/mailer.service';

@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: DB_TYPE,
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB,
        entities: [AccessCodes],
        synchronize: true
      }),
      TypeOrmModule.forFeature([AccessCodes])
    ],
    controllers: [MailController],
    providers: [AccessCodesService, MailerService],
})
export class AppModule {}
