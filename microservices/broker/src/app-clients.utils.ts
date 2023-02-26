import { FactoryProvider } from "@nestjs/common";
import {ClientGrpc, ClientProviderOptions, Transport} from "@nestjs/microservices";
import * as path from "path";

interface ConfingModuleArgs {
    port: number,
    pkgName: string,
    host: string,
    protoPath: string,
    serviceName: string
}
export interface ConfigModule {
    PORT: number,
    PACKAGE: string,
    HOST: string,
    PROTO: string,
    SERVICE: string,
    PROVIDER: string,
    DEPENDENCY: string
}

/*
    @returns полное описание клиентского модуля микросервиса, его название в брокере и необходимые зависимости из ClientsModule.register()
*/
export const GetModuleConfig = (data: ConfingModuleArgs): ConfigModule => ({
    PORT: data.port,
    PACKAGE: data.pkgName,
    HOST: `${data.host}:${data.port}`,
    PROTO: data.protoPath,
    SERVICE: data.serviceName,
    PROVIDER: `${data.pkgName.toUpperCase()}_SERVICE`,
    DEPENDENCY: `${data.pkgName.toUpperCase()}_PACKAGE`
})

/*
    @returns конфиг для ClientsModule.register
*/
export const GetClientOptionsByConfig = (config: ConfigModule): ClientProviderOptions => ({
    name: config.DEPENDENCY,
    transport: Transport.GRPC,
    options: {
        url: config.HOST,
        package: config.PACKAGE,
        protoPath: config.PROTO,
        loader: {
            keepCase: true
        }
    }
})

/*
    @returns сервис который можно использовать через @Inject(Service Name). Имя сервиса можно узнать из GetClientProvider(args).provide или соответсвующего модуля конфига из GetModuleConfig(Module Name).PROVIDER
*/
export const GetClientProvider = <T>(moduleConfig: ConfigModule): FactoryProvider => ({
    provide: moduleConfig.PROVIDER,
    inject: [{token: moduleConfig.DEPENDENCY, optional: false}],
    useFactory: (modulePackage: ClientGrpc): T => {
        return modulePackage.getService<T>(moduleConfig.SERVICE)
    }
})

/*
    @returns путь к соответсутвуещему прото-файлу   
*/

export const GetProtoPath = (protoFileName: string) => path.join(process.cwd(), `src/proto/${protoFileName}.proto`)