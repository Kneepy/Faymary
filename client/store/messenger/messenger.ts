import { defineStore } from "pinia";
import type { Messenger } from "~/store/messenger/types";
import type { LikesCollection, Message } from "~/api";

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

        updateMessageDialog(updatedMessage: Partial<Message>) {
            const dialog = this.dialogs.find(v => v.id === updatedMessage.dialog_id)

            if (!dialog) return

            const message = dialog.messages.find(v => v.id === updatedMessage.id)

            if (!message) return

            Object.entries(updatedMessage).forEach(([key, value]) =>
                message[key] !== value && (message[key] = value)
            )
        },

        addLikeMessage({ id, dialog_id }: Message, like: LikesCollection) {
            const dialog = this.dialogs.find(v => v.id === dialog_id)

            if (!dialog) return

            const { attachments } = dialog.messages.find(v => v.id === id)

            if (!attachments.likes) attachments.likes = []

            const existCollection = attachments.likes.find(v => v.id === like.id || v.unity === like.unity)

            if (existCollection) {
                existCollection.number_likes = like.number_likes
            } else {
                attachments.likes.push(like)
            }
        },

        changeCurrentDialog(id: string) {
            this.currentDialog = id;
        }
    }
})
