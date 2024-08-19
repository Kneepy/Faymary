import type { LikesCollection, Message } from "~/api";
import { Socket, WS_EVENTS } from "~/api";

interface AddReactionResponse {
    message: Message
    like: LikesCollection
}

export const MessagesWsAPI = {

    async addReaction({ message_id, emoji }: { message_id: string; emoji: string }): Promise<AddReactionResponse> {

        return Socket.send<AddReactionResponse>(WS_EVENTS.DIALOG.MESSAGE.ADD_REACTION, { unity: emoji, message_id }) as any

    },

    /**
     * Это слушатель новых реакций для сообщений
     */
    listenNewReactions(callback: (value: AddReactionResponse) => void) {

        Socket.on<AddReactionResponse>(WS_EVENTS.DIALOG.MESSAGE.ADD_REACTION, (value) => callback(value))

    }
}