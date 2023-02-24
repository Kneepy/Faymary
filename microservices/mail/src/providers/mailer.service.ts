import { FactoryProvider } from "@nestjs/common"
import { MAILER_SERVICE, SMTP } from "src/app.constants"
import * as nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"

export const MailerService: FactoryProvider = {
    provide: MAILER_SERVICE,
    useFactory: (): Mail => 
        nodemailer.createTransport(/*{
            host: SMTP.HOST,
            port: SMTP.PORT,
            secure: true,
            auth: {
                user: SMTP.USER,
                pass: SMTP.PASS
            }
        }*/)
}