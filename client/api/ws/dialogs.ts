import type { Dialog, DialogParticipants } from "~/api";
import { Socket } from "~/api/ws";
import { WS_EVENTS } from "~/api";

interface CustomDialogParticipants extends Pick<DialogParticipants, "rights" | "user_id"> {}

export const DialogsWsAPI = {
    async createDialog({ participants, name }: { participants: CustomDialogParticipants[], name: string }): Promise<Dialog> {

        const dialog = await Socket.send<Dialog>(WS_EVENTS.DIALOG.CREATE, { participants, name }) as Dialog
        console.log(dialog)

        return dialog
    }
}