import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        h: 2
    }),
    actions: {
        isAuth(): boolean {
            return !!useCookie("refresh").value
        }
    }
})