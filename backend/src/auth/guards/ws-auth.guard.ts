import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { IncomingMessage } from "http";
import { ICustomSocket } from "src/common";

@Injectable()
export class WsAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToWs()
        const client: ICustomSocket = ctx.getClient();
        const data: IncomingMessage = ctx.getData()
        console.log(ctx.getData().headers)
        return true;
    }
}
