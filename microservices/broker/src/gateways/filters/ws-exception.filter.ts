import { WEVENTS } from './../enums/events.enum';
import { Catch, ArgumentsHost } from "@nestjs/common";
import { WsException, WsResponse, BaseWsExceptionFilter } from "@nestjs/websockets";
import { ICustomSocket } from "../types/socket.type";

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: WsException, host: ArgumentsHost) {
        const client: ICustomSocket = host.switchToWs().getClient();

        client.send(JSON.stringify({event: WEVENTS.ERROR, data: exception} as WsResponse<WsException>));
    }
}