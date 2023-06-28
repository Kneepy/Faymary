import { defineStore } from "pinia";
import { Notification } from "~/api";

export const useNotificationStore = defineStore("notifications", {
    state: (): {notifications: Notification[]} => ({
        notifications: []
    }),
    actions: {
        async getNotifications({take, skip}: {take: number, skip: number}): Promise<Notification[]> {
            const res = await useCustomFetch("/notifications", {method: "GET", query: {take, skip}})

            if(res.error.value?.data) throw res.error.value?.data

            return res.data.value
        }
    }
})