import { WebSocketAdapter, WsMessageHandler } from "@nestjs/common";
import { MessageMappingProperties } from "@nestjs/websockets";
import { EMPTY, filter, fromEvent, mergeMap, Observable } from "rxjs";
import * as WebSocket from "ws";

export class WsAdapter implements WebSocketAdapter {
    private users: Map<string, string> = new Map();

    public create(port: number, options: WebSocket.ServerOptions): WebSocket.Server {
        return new WebSocket.Server({ port: port, ...options });
    }

    public bindClientConnect(server, callback: Function) {
        server.on("connection", callback);
    }

    public bindMessageHandlers(
        client: WebSocket,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>
    ) {
        fromEvent(client, "message")
            .pipe(
                mergeMap(data =>
                    this.bindMessageHandler(data, handlers, process)
                ),
                filter(result => result)
            )
            .subscribe(response => client.send(JSON.stringify(response)));
    }

    public bindMessageHandler(
        buffer,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>
    ): Observable<any> {
        const message = JSON.parse(buffer.data);
        const messageHandler = handlers.find(
            handler => handler.message === message.event
        );
        if (!messageHandler) {
            return EMPTY;
        }
        return process(messageHandler.callback(message.data));
    }

    public close(server: WebSocket.Server) {
        server.close();
    }
}
