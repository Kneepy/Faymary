import { defineStore } from "pinia";
import { type Notification } from "~/api";

export const useNotificationStore = defineStore("notifications", {
    state: (): {notifications: Notification[]} => ({
        notifications: []
    }),
    actions: {
        /**
         * Эту тему уже под конец проекта нужно будет доделывать
         */
        async getNotifications({take, skip}: {take: number, skip: number}): Promise<Notification[]> {
            const res = await useCustomFetch<Notification[]>("/notifications", {method: "GET", query: {take, skip}})

            //if(res.error.value?.data) throw res.error.value?.data
            return []
        }
    }
})