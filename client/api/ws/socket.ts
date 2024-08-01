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

    private static emit(event: string, data: any): void {
        if (!this.listeners.has(event)) return

        const listeners = this.listeners.get(event)

        listeners.forEach((listener) => listener(data))
    }

    static init(host: string, { authorization, fingerprint, session_id }: SocketInitParams): void {
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
            console.log("new message", response)

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
     * Отправляет сообщение на websocket сервер
     * @param event событие по кторому производится отправка
     * @param data данные которые необходимо отправить
     * @param callback в эту функцию будут переданы данные полученые из одноименного event
     * По факту эта функция отправляет какие-то данные и сразу же получает данные
     */
    static send<T = any>(event: string, data: any, callback?: (data: T) => void): void | Promise<T> {
        const request= JSON.stringify({ event, data })
        this.socket.send(request)

        if (!callback) return new Promise((resolve, reject) => this.on(event, resolve))

        this.on(event, callback)
    }

    /**
     * Проверяет запущен ли сокет
     */
    static isReady() {
        return this.socket?.readyState === 1
    }

    /**
     * @param event событие данные из которого мы хотим вытащить
     * @param callback функция в которую будут переданы данные плученые по этому событию
     * Если callback не был передан то вернётся Promise<T>
     * Который будет содержать данные которые должны были попасть в callback
     * Применение Promise я на самом деле не сильно вижу но оставлю для вариативности
     */
    static on<T = any>(event: string, callback?: (data: T) => any): void | Promise<T> {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set())

        const listener = this.listeners.get(event)

        if (!callback) return new Promise<T>((resolve, reject) => listener.add(resolve))

        listener.add(callback)
    }

}