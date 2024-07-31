import type { WsResponse } from "./types";

interface SocketInitParams {
    authorization: string
    fingerprint: string
    session_id: string
    countReconnect?: number
}

export class Socket {
    static socket: WebSocket

    static init(host: string, { authorization, fingerprint, session_id, countReconnect }: SocketInitParams): void {
        if(process.server) return

        if(!authorization || !fingerprint || !session_id) return

        const urlConnection = new URL(host)

        /**
         * Эта тема нужна вместо заголовков при подключении
         */
        urlConnection.searchParams.set("authorization", authorization)
        urlConnection.searchParams.set("fingerprint", fingerprint)
        urlConnection.searchParams.set("session_id", session_id)

        this.socket = new WebSocket(urlConnection)

        /**
         * Переподключение в случае отключения
         */
        this.socket.onclose = () => {
            this.socket = null

            setInterval(() => {
                console.log("reconnect to ws server")
                this.socket = new WebSocket(urlConnection)

            }, 5000)
        }
        this.socket.onopen = () => {
            console.log("ws is connect 🥰💀✌️🌴")
        }
    }

    static on<T = any>(event: string, callback: (data: T) => any) {
        if (!this.socket) return

        this.socket.onmessage = (e: MessageEvent) => {
            const response: WsResponse = JSON.parse(e.data)

            if (response.event !== event) return

            callback(response.data)
        }
    }

    static isReady() {
        return this.socket?.readyState === 1
    }
}