import { defineStore } from "pinia";
import { Dialog } from "./types/dialog.type";
import { Message } from "./types/message.type";

export const useDialogsStore = defineStore("dialogs", {
    actions: {
        async getDialog({id}: Pick<Dialog, "id">): Promise<Dialog> {
            return (await useCustomFetch("/dialog", {method: "GET", query: {id}})).data.value
        },
        async getMessage({id}: Pick<Message, "id">): Promise<Message> {
            return (await useCustomFetch("/dialog/message", {method: "GET", query: {id}})).data.value
        }
    }
})