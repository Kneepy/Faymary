import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ICustomSocket } from "src/common";

@Injectable()
export class WsAuthGuard implements CanActivate {
    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const client: ICustomSocket = ctx.switchToWs().getClient()
        
        return true
    }
}