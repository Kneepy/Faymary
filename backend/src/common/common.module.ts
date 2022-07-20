import { MySqlModule } from '../mysql/mysql.module';
import { Global, Module } from "@nestjs/common";
import * as commonProviders from "./providers";
import { AuthModule } from '../auth/auth.module';

const services = [...Object.values(commonProviders)];

@Global()
@Module({
    imports: [MySqlModule, AuthModule],
    providers: services,
    exports: services,
})
export class CommonModule {}
