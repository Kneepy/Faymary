import { ICustomSocket } from "../interfaces"

export class WsUsersStore {
    private users: Map<string, ICustomSocket> = new Map()

    find(socketId: string): ICustomSocket {
        return this.users.get(socketId)
    }

    set(socketId: string, socket: ICustomSocket) {
        return this.users.set(socketId, socket)
    }

    delete(socketId: string) {
        return this.users.delete(socketId)
    }
}