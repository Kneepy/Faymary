import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MailerService } from './mailer.service';
import * as nodemailer from "nodemailer"
import { MailerModuleAsyncOptions, MailerModuleOptions, MailerOptionsFactory } from './mailer.interface';
import { MAILER_MODULE } from './mailer.constants';
import * as Mail from "nodemailer/lib/mailer"

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {
    static register(mailerOptions: MailerModuleOptions): DynamicModule {
        return {
            module: MailerModule,
            providers: [
                {
                    provide: MAILER_MODULE,
                    useFactory: (): Mail => nodemailer.createTransport({...mailerOptions, secure: true})
                }
            ]
        }
    }

    static registerAsync(options: MailerModuleAsyncOptions): DynamicModule {
        return {
            module: MailerModule,
            imports: options.imports,
            providers: this.createAsyncProviders(options)
        }
    }

    private static createAsyncProviders(options: MailerModuleAsyncOptions): Provider[] {
        if(options.useFactory) {
            return [this.createAsyncOptionsProvider(options)]
        }

        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass
            }
        ]
    }

    private static createAsyncOptionsProvider(options: MailerModuleAsyncOptions): Provider {
        if(options.useFactory) {
            return {
                provide: MAILER_MODULE,
                useFactory: function () {
                    return nodemailer.createTransport({...options.useFactory, secure: true})
                },
                inject: options.inject || []
            }
        }
        
        return {
            provide: MAILER_MODULE,
            inject: [options.useClass || options.useExisting],
            useFactory: async (optionsFactory: MailerOptionsFactory) => {
                return nodemailer.createTransport({...(await optionsFactory.createMailerOptions()), secure: true})
            }
        }
    }
}
