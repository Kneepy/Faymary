import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import Mail from 'nodemailer/lib/mailer';
import { AccessCodes } from './access-codes.entity';
import {MAIL_SERVICE_METHODS, MAIL_SERVICE_NAME, MAILER_SERVICE, NotFoundEmail, LIFE_TIME_ACCESS_CODE} from './constants';
import { SendAccessCodeDTO } from './dtos/send-access-code.dto';
import {AccessCodesService} from "./providers";

@Controller()
export class MailController {
    constructor(
        @Inject(MAILER_SERVICE) private mailerService: Mail,
        private accessCodesService: AccessCodesService
    ) {}

    @GrpcMethod(MAIL_SERVICE_NAME, MAIL_SERVICE_METHODS.SEND_ACCESS_CODE)
    async sendAccessCode(data: SendAccessCodeDTO): Promise<AccessCodes & {expiresIn: number}> {
        console.log(data)
        if(data.email) {
            const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
            const accessCode = await this.accessCodesService.create({code, user_id: data.user_id})
            const mail = this.mailerService.sendMail({
                from: "Faymary <ilyafamin4@gmail.com>",
                to: data.email,
                subject: "Account Confirmation",
                text: `${code}`
            })

            return {
                ...accessCode,
                expiresIn: accessCode.createdAt + LIFE_TIME_ACCESS_CODE
            }
        } else throw NotFoundEmail
    }
}
