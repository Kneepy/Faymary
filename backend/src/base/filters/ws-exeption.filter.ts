import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch()
export class WsExeptionFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        console.log(host)
        const ctx = host.switchToWs()
        const client = ctx.getClient()
        console.log(client)
    }
}