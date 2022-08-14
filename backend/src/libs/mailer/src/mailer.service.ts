import { Inject, Injectable } from '@nestjs/common';
import { MAILER_MODULE } from './mailer.constants';
import Mail from "nodemailer/lib/mailer"

@Injectable()
export class MailerService {
    constructor(@Inject(MAILER_MODULE) private mailer: Mail) {}

    async send(options: Mail.Options) {
        return await this.mailer.sendMail(options)
    }
}
