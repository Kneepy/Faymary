import { WebSocketAdapter, WsMessageHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import * as WebSocket from "ws"

export class WsAdapter implements WebSocketAdapter {
    private users: Map<string, string> = new Map()

    create(port: number, options: WebSocket.ServerOptions) {
        return new WebSocket.Server({port: port, ...options})
    }

    bindClientConnect(server: any, callback: Function) {
        server.on("connection", callback)
        //throw new Error("Method not implemented.");
    }

    bindClientDisconnect?(client: any, callback: Function) {
        throw new Error("Method not implemented.");
    }

    bindMessageHandlers(client: any, handlers: WsMessageHandler<string>[], transform: (data: any) => Observable<any>) {
        throw new Error("Method not implemented.");
    }

    close(server: any) {
        throw new Error("Method not implemented.");
    }
}