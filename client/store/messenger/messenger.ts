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

            let startIndex = dialog.messages.length - 1
            let endIndex = 0

            while (startIndex >= endIndex) {
                const midIndex = Math.floor((startIndex + endIndex) / 2)
                const midCreatedAt = Number(dialog.messages[midIndex]?.createdAt)

                if (midCreatedAt === createdAt) {
                    dialog.messages.splice(midIndex + 1, 0, message)
                    return
                } else if (midCreatedAt > createdAt) {
                    endIndex = midIndex + 1
                } else {
                    startIndex = midIndex - 1
                }
            }

            dialog.messages.splice(startIndex + 1, 0, message)
        },

        updateMessageDialog(updatedMessage: Message) {
            const dialog = this.dialogs.find(v => v.id === updatedMessage.dialog_id)

            if (!dialog) return

            const message = dialog.messages.find(v => v.id === updatedMessage.id)

            if (!message) return

            Object.entries(updatedMessage).forEach(([key, value]) =>
                message[key] !== value && (message[key] = value)
            )
        },

        /**
         * По факту эта функция нужна только чтобы при получении новых лайков с сервера обновлять их количество
         */
        insertLikeMessage({ id, dialog_id }: Message, like: LikesCollection) {
            const dialog = this.dialogs.find(v => v.id === dialog_id)

            if (!dialog) return

            const { attachments } = dialog.messages.find(v => v.id === id)

            if (!attachments.likes) attachments.likes = []

            let existCollection = attachments.likes.find(v => v.id === like.id)

            if (existCollection) {
                existCollection.number_likes = like.number_likes
                existCollection.has_liked = like.has_liked
                existCollection.unity = like.unity
            } else {
                attachments.likes.unshift(like)
            }
        },

        changeCurrentDialog(id: string) {
            this.currentDialog = id;
        }
    }
})
