import { defineStore } from "pinia";

export const useAppStateStore = defineStore("app-state", {
    state: () => ({
        load: false,
        /**
         * Bearer токен отправляемый серверу (указывается без приставки Bearer)
         */
        authorization: "",
        /**
         * Токен авторизации лежащий где-то в куках, но я хз как использовать его из стора т.к он каждый раз будет отличаться от текущего 100 из 100
         * Поэтому просто так пускай тут лежит
         */
        refresh_token: useCookie(useRuntimeConfig().public.sessionCookie).value          
    })
})