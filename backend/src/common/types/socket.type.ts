import { Activity, Users } from "src/entity";
import type WebSocket from "ws";

export interface ICustomSocket extends WebSocket.WebSocket {
    id: string; // socket id = user id
    user: Users;
    state: Activity;
}
