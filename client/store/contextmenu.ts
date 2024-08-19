import { defineStore } from "pinia";

export const useContextMenuStore = defineStore("contextmenu", {
    state: () => ({
        is_show: false,
        x: null,
        y: null
    }),
    actions: {
        open(x: number, y: number) {
            this.close()

            this.is_show = true
            this.x = x
            this.y = y
        },
        close() {
            this.is_show = false
        }
    }
})
