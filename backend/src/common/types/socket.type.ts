import { Activity } from "src/entity";
import type WebSocket from "ws";

export interface ICustomSocket extends WebSocket.WebSocket {
    id: string; // socket id = user id
    state: Activity;
}
