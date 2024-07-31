import { defineStore } from "pinia";

export const useAppStateStore = defineStore("app-state", {
    state: () => ({
        load: false,

        /**
         * Bearer токен отправляемый серверу (указывается без приставки Bearer)
         * Устанавливается в момент первого запроса к серверу (можно найти в useCustomFetch или auth middleware)
         */
        authorization: "",

        /**
         *  По факту это refresh_token с сервера
         *  Я буду хранить его сдесь так как из кук его не получается достать
         *  А куки автоматом прикрепляются к запросу при отправке
         */
        session: "",

        /**
         * Уникальный ключ устройства
         * Устанавливается в момент первого запроса к серверу (можно найти в useCustomFetch или auth middleware)
         */
        fingerprint: ""

    }),
    actions: {
        setAuthorization(authorization: string) {
            this.authorization = authorization;
        },
        setSession(session: string) {
            this.session = session;
        },
        setFingerprint(fingerprint: unknown) {
            this.fingerprint = fingerprint;
        }
    }
})