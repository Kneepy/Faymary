import { Inject, Injectable } from "@nestjs/common";
import { MAILER_MODULE } from "./mailer.constants";
import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailerService {
    constructor(@Inject(MAILER_MODULE) private mailer: Mail) {
        this.transporter = nodemailer.createTransport(this.mailer)
    }

    private transporter: Mail

    async send(options: Mail.Options) {
        try {
            return await this.transporter.sendMail(options) 
        } catch (error) {
            throw error
        }
    }
}
