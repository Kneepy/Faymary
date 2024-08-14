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

        /**
         * @param dialog_id ID диалога в который нужно добавить сообщение
         * @param messages массив сообщений которые нужно добавить в диалог
         * Эта функция производит вставку сообщений согласно их атрибуту createdAt (типа выстраивает сообщения в порядке увеличения его)
         */
        insertMessagesDialog(dialog_id: string, messages: Message[]) {
            const dialog = this.dialogs.find(v => v.id === dialog_id);

            if (!dialog) return

            for (const message of messages) {
                if (!dialog.messages) dialog.messages = []

                const messageExist = dialog.messages.find(v => v.id === message.id)

                if (messageExist) continue

                this.insertMessageDialog(dialog, message)
            }

            dialog.lastMessage = dialog.messages[0]
        },

        /**
         * @param dialog ссылка на диалог в который нужно вставить сообщение
         * @param message сообщение которое нужно добавить в диалог
         * Вставка сообщения по возрастанию атрибута createdAt
         */
        insertMessageDialog(dialog: Messenger.Dialog, message: Message) {
            const createdAt = Number(message.createdAt)

            if (!dialog || !createdAt) return

            let msgPos = 0

            while (msgPos < dialog.messages.length && Number(dialog.messages[msgPos]?.createdAt) > createdAt) {
                msgPos++
            }

            dialog.messages.splice(msgPos, 0, message)
        },
        changeCurrentDialog(id: string) {
            this.currentDialog = id;
        }
    }
})
