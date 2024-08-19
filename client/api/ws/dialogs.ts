import { type Dialog, type DialogParticipants, type Message, WS_EVENTS, Socket } from "~/api";

interface CustomDialogParticipants extends Pick<DialogParticipants, "rights" | "user_id"> {}
interface CreateMessage extends Pick<Message, "dialog_id" | "msg" | "attachments"> {}

export const DialogsWsAPI = {
    async createDialog({ participants, name }: { participants: CustomDialogParticipants[], name: string }): Promise<Dialog> {

        return await Socket.send<Dialog>(WS_EVENTS.DIALOG.CREATE, { participants, name }) as Dialog

    },
    async createMessage({ attachments, dialog_id, msg }: CreateMessage): Promise<Message> {

        return await Socket.send<Message>(WS_EVENTS.DIALOG.MESSAGE.CREATE, { attachments, dialog_id, msg }) as Message;

    },

    /**
     * Это слушатель новых сообщений
     * Если приходит событие содержащие новое сообщение то оно передаётся в callback
     */
    listenNewMessages(callback: (message: Message) => void): void {

        Socket.on<Message>(WS_EVENTS.DIALOG.MESSAGE.CREATE, (message) => callback(message))

    },

    /**
     * Это слушатель новых диалогов
     * Если приходит событие содержащие новый диалог то оно передаётся в callback
     */
    listenNewDialogs(callback: (dialog: Dialog) => void): void {

        Socket.on<Dialog>(WS_EVENTS.DIALOG.CREATE, (dialog) => callback(dialog))

    }
}