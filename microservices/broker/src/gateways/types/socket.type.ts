import { Profile } from "src/proto/profiles"
import { WebSocket } from "ws"

export interface ICustomSocket extends WebSocket {
    /* 
        id сессии к которой подключен сокет
        id сессии получается из auth микросериса и находится в VerifyTokensDTO интерфейсе
    */
    session_id: string

    /* 
        это поле соответсвует имени ключа в списке всех подключенных пользователей (this.users<key = user_id, ...>)
        id пользователя к которому подключен сокет (у одного пользователя может быть несколько подключенных сокетов) 
    */
    user_id: string

    /**
     * Настройки пользователя небоходимые для отправки уведомлений (какие уведомления отправлять, а какие нет)
     */
    settings: Profile
}