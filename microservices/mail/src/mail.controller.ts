import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import Mail from 'nodemailer/lib/mailer';
import { AccessCodes } from './access-codes.entity';
import {MAIL_SERVICE_METHODS, MAIL_SERVICE_NAME, MAILER_SERVICE, NotFoundEmail, LIFE_TIME_ACCESS_CODE} from './constants';
import {AccessCodesService} from "./providers";
import {ConfirmAccessCodeDTO, SendAccessCodeDTO} from "./dtos";
import {IsConfirmedAccessCodeInterface} from "./interfaces";

@Controller()
export class MailController {
    constructor(
        @Inject(MAILER_SERVICE) private mailerService: Mail,
        private accessCodesService: AccessCodesService
    ) {}

    @GrpcMethod(MAIL_SERVICE_NAME, MAIL_SERVICE_METHODS.SEND_ACCESS_CODE)
    async sendAccessCode(data: SendAccessCodeDTO): Promise<AccessCodes & {expiresIn: number}> {
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

    @GrpcMethod(MAIL_SERVICE_NAME, MAIL_SERVICE_METHODS.CONFIRM_ACCESS_CODE)
    async confirmAccessCode(data: ConfirmAccessCodeDTO): Promise<IsConfirmedAccessCodeInterface> {
        const accessCode = await this.accessCodesService.findOne({user_id: data.user_id})
        const isConfirmed = !!accessCode ? accessCode.code === data.code : false

        if(isConfirmed) await this.accessCodesService.delete(accessCode.id)

        return {isConfirmed}
    }
}
