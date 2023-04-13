import { defineStore } from "pinia";
import { Notification } from "./types/notification.type";
import { AdditionsType } from "./types/additions.type";

export const useNotificationStore = defineStore("notifications", {
    state: (): {notifications: Notification[]} => ({
        notifications: []
    }),
    actions: {
        async getNotifications({take, skip}: {take: number, skip: number}): Promise<Notification[]> {
            const res = await useCustomFetch("/notifications", {method: "GET", query: {take, skip}})

            if(res.error.value?.data) throw res.error.value?.data

            res.data.value = await Promise.all(res.data.value.map(async (notification: Notification) => {
                if(notification.type in AdditionsType) {
                    const item = useItem(notification.type, notification.item_id)
                    notification.item = {}
                    notification.item[item.key] = await item.data
                }
                if(notification.parent_type in AdditionsType) {
                    const parent = useItem(notification.parent_type, notification.parent_id)
                    notification.parent = {}
                    notification.parent[parent.key] = await parent.data
                }

                return notification
            }))

            return res.data.value
        }
    }
})