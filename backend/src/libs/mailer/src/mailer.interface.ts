import { ModuleMetadata, Type } from "@nestjs/common"

export interface MailerModuleOptions {
    host: string
    port: number
    auth: {
        user: string
        pass: string
    }
}

export interface MailerOptionsFactory {
    createMailerOptions(): Promise<MailerModuleOptions>
}

export interface MailerModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<MailerOptionsFactory>;
    useClass?: Type<MailerOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<MailerModuleOptions> | MailerModuleOptions;
    inject?: any[];
}