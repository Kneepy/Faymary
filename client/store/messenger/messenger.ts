import { defineStore } from "pinia";
import type { Messenger } from "~/store/messenger/types";
import type { Message } from "~/api";

export const useMessengerStore = defineStore("messenger", {
    state: (): Messenger.Store => ({
        dialogs: [],
        currentDialog: null
    }),
    actions: {
        addDialogs(dialogs: Messenger.Dialog[]) {
            for (const dialog of dialogs) {
                const dialogExist = this.dialogs.find(v => v.id === dialog.id);

                if (!!dialogExist) return
                this.dialogs.push(dialog);
            }
        },
        addMessagesDialog(dialog_id: string, messages: Message[]) {
            const dialog = this.dialogs.find(v => v.id === dialog_id);

            if (!dialog) return

            for (const message of messages) {
                if (!dialog.messages) dialog.messages = []

                const messageExist = dialog.messages.find(v => v.id === message.id)

                if (messageExist) return

                dialog.messages.push(message);
            }

            dialog.lastMessage = messages.pop()
        },
        changeCurrentDialog(id: string) {
            this.currentDialog = id;
        }
    }
})
