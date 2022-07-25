import { Global, Module } from "@nestjs/common";
import * as commonProviders from "./providers";

const services = [...Object.values(commonProviders)];

@Global()
@Module({
    providers: services,
    exports: services
})
export class CommonModule {}
