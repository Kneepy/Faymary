import { RpcException } from '@nestjs/microservices';
import { WEVENTS } from './../enums/events.enum';
import { Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { WsException, WsResponse, BaseWsExceptionFilter } from "@nestjs/websockets";
import { ICustomSocket } from "../types/socket.type";

@Catch(WsException, RpcException, HttpException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: WsException, host: ArgumentsHost) {
        const client: ICustomSocket = host.switchToWs().getClient();
        console.log(exception)
        client.send(JSON.stringify({event: WEVENTS.ERROR, data: exception} as WsResponse<WsException>));
    }
}