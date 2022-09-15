import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { IncomingMessage } from "http";
import { ICustomSocket } from "src/common";

@Injectable()
export class WsAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToWs();
        const client = ctx.getClient();
        const data = ctx.getData();
        return true;
    }
}
