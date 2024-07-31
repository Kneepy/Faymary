import { defineStore } from "pinia";
import type { Messenger } from "~/store/messenger/types";

export const useMessengerStore = defineStore("messenger", {
    state: (): Messenger.Store => ({
        dialogs: [],
        currentDialog: null
    }),
    actions: {
        addDialogs(dialogs: Messenger.CustomDialog[]) {
            for (const dialog of dialogs) {
                const dialogExist = this.dialogs.find(v => v.id === dialog.id);

                if (!!dialogExist) return
                this.dialogs.push(dialog);
            }
        },
        changeCurrentDialog(id: string) {
            this.currentDialog = id;
        }
    }
})
