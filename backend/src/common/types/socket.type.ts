import { Activity } from "src/entity";
import WebSocket from "ws";

export interface ICustomSocket extends WebSocket.WebSocket {
    id: string
    state: Activity
}