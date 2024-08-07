import { type Dialog, type DialogParticipants, type Message, WS_EVENTS, Socket } from "~/api";
import type { CreateDialog } from "~/store/messenger";

interface CustomDialogParticipants extends Pick<DialogParticipants, "rights" | "user_id"> {}
interface CreateMessage extends Pick<Message, "dialog_id" | "msg" | "user_id"> {
    attachments: CreateDialog.Attachment[]
}

export const DialogsWsAPI = {
    async createDialog({ participants, name }: { participants: CustomDialogParticipants[], name: string }): Promise<Dialog> {

        return await Socket.send<Dialog>(WS_EVENTS.DIALOG.CREATE, { participants, name }) as Dialog

    },
    async createMessage({ attachments, dialog_id, user_id, msg }: CreateMessage): Promise<Message> {

        return await Socket.send<Message>(WS_EVENTS.DIALOG.MESSAGE.CREATE, { attachments, dialog_id, user_id, msg }) as Message;

    }
}