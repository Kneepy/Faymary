import { ArgumentsHost, Catch } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { ICustomSocket } from "src/common";

@Catch(WsException)
export class WsExeptionFilter implements WsExeptionFilter {
    catch(exception: WsException, host: ArgumentsHost) {
        const client: ICustomSocket = host.switchToWs().getClient()
        client.send(JSON.stringify(exception))
    }
}