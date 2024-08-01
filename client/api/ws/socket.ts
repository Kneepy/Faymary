import type { WsResponse } from "./types";

interface SocketInitParams {
    authorization: string
    fingerprint: string
    session_id: string
    countReconnect?: number
}

export class Socket {
    private static socket: WebSocket
    private static listeners: Map<string, Set<(data: any) => void>> = new Map()

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

        this.socket.onopen = () => {
            console.log("ws is connect 🥰💀✌️🌴")
        }

        this.socket.onmessage = (message: MessageEvent) => {
            const response: WsResponse = JSON.parse(message.data)

            this.emit(response.event, response.data)
        }

        /**
         * Переподключение в случае отключения
         */
        this.socket.onclose = () => {
            this.socket = null

            setInterval(() => {
                console.log("reconnect to ws server 💀✌️")
                this.socket = new WebSocket(urlConnection)

            }, 5000)
        }
    }

    /**
     * @param event событие данные из которого мы хотим вытащить
     * @param callback функция в которую будут переданы данные плученые по этому событию
     */
    static on<T = any>(event: string, callback?: (data: T) => any): void {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set())

        const listener = this.listeners.get(event)
        listener.add(callback)
    }

    private static emit(event: string, data: any): void {
        if (!this.listeners.has(event)) return

        const listeners = this.listeners.get(event)

        listeners.forEach((listener) => listener(data))
    }

    static send<T = any>(event: string, data: any): void {
        const request= JSON.stringify({ event, data })

        this.socket.send(request)
    }

    static isReady() {
        return this.socket?.readyState === 1
    }
}