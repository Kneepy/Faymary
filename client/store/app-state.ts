import { defineStore } from "pinia";

export const useAppStateStore = defineStore("app-state", {
    state: () => ({
        load: false,
        /**
         * Bearer токен отправляемый серверу (указывается без приставки Bearer)
         */
        authorization: "",
    })
})