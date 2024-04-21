import { DynamicModule, Module } from "@nestjs/common";
import { RedisClientOptions, createClient } from "redis";
import { REDIS_PROVIDER } from "src/common";

@Module({})
export class RedisModule {
    static forRoot(options: RedisClientOptions): DynamicModule {
        return {
            module: RedisModule,
            providers: [
                {
                    provide: REDIS_PROVIDER,
                    useValue: createClient(options).connect()
                },
            ],
            exports: [REDIS_PROVIDER]
        }
    }
}